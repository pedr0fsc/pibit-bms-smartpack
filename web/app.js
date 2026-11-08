(function () {
  var client = null;
  var devices = {};
  var cells = {};
  var logEl = document.getElementById("log");
  var stateEl = document.getElementById("state");
  var tbody = document.querySelector("#devs tbody");
  var empty = document.getElementById("empty");
  var cellsBody = document.querySelector("#cells tbody");
  var cellsEmpty = document.getElementById("cells-empty");
  var packMeta = document.getElementById("pack-meta");
  var btnOn = document.getElementById("btn-on");
  var btnOff = document.getElementById("btn-off");
  var LIFE = ["FLB", "SLB", "TLB"];

  function nowStr() {
    var d = new Date();
    function z(n) { return n < 10 ? "0" + n : "" + n; }
    return z(d.getHours()) + ":" + z(d.getMinutes()) + ":" + z(d.getSeconds());
  }

  function log(line) {
    logEl.textContent += "[" + nowStr() + "] " + line + "\n";
    logEl.scrollTop = logEl.scrollHeight;
  }

  function setState(kind, text) {
    stateEl.className = kind;
    stateEl.textContent = text;
  }

  function fmt(n, digits, suffix) {
    if (typeof n !== "number" || isNaN(n)) {
      return "—";
    }
    return n.toFixed(digits) + suffix;
  }

  function deviceIdFromTopic(topic, payload) {
    if (payload && payload.device_id) {
      return String(payload.device_id);
    }
    var parts = topic.split("/");
    if (parts.length >= 3) {
      return parts[parts.length - 2];
    }
    return topic;
  }

  function renderDht() {
    var ids = Object.keys(devices);
    if (ids.length === 0) {
      tbody.innerHTML = "";
      tbody.appendChild(empty);
      empty.style.display = "";
      return;
    }
    empty.style.display = "none";
    var html = "";
    for (var i = 0; i < ids.length; i++) {
      var d = devices[ids[i]];
      html += "<tr>" +
        "<td>" + d.id + "</td>" +
        "<td>" + (d.sensor || "—") + "</td>" +
        "<td>" + (d.gpio != null ? d.gpio : "—") + "</td>" +
        "<td>" + fmt(d.humidity_pct, 1, " %") + "</td>" +
        "<td>" + fmt(d.temp_c, 1, " °C") + "</td>" +
        "<td>" + fmt(d.temp_f, 1, " °F") + "</td>" +
        "<td>" + fmt(d.temp_k, 2, " K") + "</td>" +
        "<td>" + (d.core_acq != null ? d.core_acq : "—") + "</td>" +
        "<td>" + (d.core_mqtt != null ? d.core_mqtt : "—") + "</td>" +
        "<td>" + (d.seq != null ? d.seq : "—") + "</td>" +
        "<td>" + d.when + "</td>" +
        "</tr>";
    }
    tbody.innerHTML = html;
  }

  function renderCells() {
    var ids = Object.keys(cells).sort();
    if (ids.length === 0) {
      cellsBody.innerHTML = "";
      cellsBody.appendChild(cellsEmpty);
      cellsEmpty.style.display = "";
      return;
    }
    cellsEmpty.style.display = "none";
    var html = "";
    for (var i = 0; i < ids.length; i++) {
      var c = cells[ids[i]];
      html += "<tr>" +
        "<td>" + c.id + "</td>" +
        "<td>" + (c.v_mv != null ? c.v_mv : "—") + "</td>" +
        "<td>" + (c.i_ma != null ? c.i_ma : "—") + "</td>" +
        "<td>" + fmt(c.t_c, 2, " °C") + "</td>" +
        "<td>" + fmt(c.soc, 1, " %") + "</td>" +
        "<td>" + fmt(c.soh, 1, " %") + "</td>" +
        "<td>" + (c.life != null && LIFE[c.life] ? LIFE[c.life] : "—") + "</td>" +
        "<td>" + (c.cstate != null ? c.cstate : "—") + "</td>" +
        "<td>0x" + (c.fault != null ? Number(c.fault).toString(16) : "0") + "</td>" +
        "<td>" + c.when + "</td>" +
        "</tr>";
    }
    cellsBody.innerHTML = html;
  }

  function ingestDht(id, obj) {
    var temp_c = Number(obj.temp_c);
    var temp_f = obj.temp_f != null ? Number(obj.temp_f) : (temp_c * 9 / 5 + 32);
    var temp_k = obj.temp_k != null ? Number(obj.temp_k) : (temp_c + 273.15);
    devices[id] = {
      id: id,
      sensor: obj.sensor || "DHT11",
      gpio: obj.gpio,
      humidity_pct: Number(obj.humidity_pct != null ? obj.humidity_pct : obj.rh),
      temp_c: temp_c,
      temp_f: temp_f,
      temp_k: temp_k,
      core_acq: obj.core_acq,
      core_mqtt: obj.core_mqtt,
      seq: obj.seq,
      when: nowStr()
    };
    renderDht();
  }

  function ingestCell(id, obj) {
    cells[id] = {
      id: id,
      v_mv: obj.v_mv,
      i_ma: obj.i_ma,
      t_c: Number(obj.t_c),
      soc: Number(obj.soc),
      soh: Number(obj.soh),
      life: obj.life,
      cstate: obj.cstate,
      fault: obj.fault,
      when: nowStr()
    };
    renderCells();
  }

  function ingestStatus(obj) {
    if (obj.t_amb_c != null || obj.rh != null) {
      ingestDht(obj.device_id || "esp32", {
        sensor: "DHT11",
        humidity_pct: obj.rh,
        temp_c: obj.t_amb_c,
        device_id: obj.device_id
      });
    }
    if (obj.pack_state != null) {
      packMeta.textContent =
        "dispositivo " + (obj.device_id || "—") +
        "  pack_st=" + obj.pack_state +
        "  vsum=" + (obj.vsum_mv != null ? obj.vsum_mv + " mV" : "—") +
        "  I=" + (obj.i_ma != null ? obj.i_ma + " mA" : "—") +
        "  ambiente=" + (obj.ambient_ok ? "ok" : "falha");
    }
    if (obj.cells && obj.cells.length) {
      for (var i = 0; i < obj.cells.length; i++) {
        ingestCell("cell_" + obj.cells[i].cell, obj.cells[i]);
      }
    }
  }

  function onPayload(topic, obj, raw) {
    log((topic || "/api") + "  " + raw);
    if (!obj) {
      return;
    }
    if (obj.kind === "dht11" || (obj.sensor === "DHT11" && obj.temp_c != null)) {
      ingestDht(deviceIdFromTopic(topic || "local", obj), obj);
      return;
    }
    if (obj.kind === "bms" && obj.cells) {
      ingestStatus(obj);
      return;
    }
    if (obj.v_mv != null || obj.kind === "bms") {
      ingestCell(deviceIdFromTopic(topic || "local", obj), obj);
      if (obj.t_amb_c != null) {
        ingestDht(obj.device_id || "esp32", {
          sensor: "DHT11",
          humidity_pct: obj.rh,
          temp_c: obj.t_amb_c
        });
      }
      return;
    }
    if (obj.temp_c != null) {
      ingestDht(deviceIdFromTopic(topic || "local", obj), obj);
    }
  }

  function onMessage(topic, buf) {
    var text = buf.toString();
    var obj = null;
    try {
      obj = JSON.parse(text);
    } catch (e) {
      obj = {};
    }
    onPayload(topic, obj, text);
  }

  function pollLocal() {
    fetch("/api/telemetry").then(function (r) {
      if (!r.ok) {
        throw new Error("http " + r.status);
      }
      return r.text();
    }).then(function (text) {
      var obj = JSON.parse(text);
      onPayload("/api/telemetry", obj, text);
      setState("on", "local /api");
    }).catch(function (err) {
      log("poll: " + (err && err.message ? err.message : err));
    });
  }

  function disconnect() {
    if (client) {
      try { client.end(true); } catch (e) {}
      client = null;
    }
    btnOn.disabled = false;
    setState("off", "desligado");
  }

  document.getElementById("conn").addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (typeof mqtt === "undefined") {
      log("Biblioteca MQTT.js nao carregou (CDN). Use o painel local em http://<ip>/");
      return;
    }
    disconnect();
    var url = document.getElementById("url").value.trim();
    var topic = document.getElementById("topic").value.trim();
    setState("wait", "ligando…");
    btnOn.disabled = true;
    log("conectando " + url);

    client = mqtt.connect(url, {
      clientId: "pibit-web-" + Math.random().toString(16).slice(2, 10),
      clean: true,
      reconnectPeriod: 4000,
      connectTimeout: 10000
    });

    client.on("connect", function () {
      setState("on", "ligado");
      log("conectado. assinando " + topic);
      client.subscribe(topic, { qos: 1 });
      if (topic.indexOf("smartpack") === -1) {
        client.subscribe("smartpack/+/telemetry", { qos: 1 });
      }
    });
    client.on("reconnect", function () {
      setState("wait", "reconectando…");
    });
    client.on("close", function () {
      if (client) {
        setState("off", "fechado");
      }
    });
    client.on("error", function (err) {
      log("erro: " + (err && err.message ? err.message : err));
    });
    client.on("message", onMessage);
  });

  btnOff.addEventListener("click", function () {
    disconnect();
    log("desligado pelo usuario");
  });

  setState("off", "desligado");
  log("Pronto. Clique em Conectar, ou aguarde o poll local.");

  if (location.protocol === "http:" || location.protocol === "https:") {
    fetch("/api/telemetry").then(function (r) {
      if (r.ok) {
        log("servidor HTTP do ESP32 detectado, poll a cada 2 s");
        pollLocal();
        setInterval(pollLocal, 2000);
      }
    }).catch(function () {});
  }
})();
