# `web/` — technician dashboard

Static page used in two ways:

1. **On the ESP32** — compiled into `board_port` (`web_assets.c`) and served at `http://<esp-ip>/`. The page polls `/api/telemetry` every 2 s (no MQTT.js needed).
2. **GitHub Pages / any HTTPS host** — open `index.html`, click Conectar, subscribe over **WSS** (`wss://broker.hivemq.com:8884/mqtt`). The firmware still publishes plain MQTT/TCP on port 1883.

One table is ambient DHT11; the other is SmartPack cells (`kind: "bms"`). Both firmwares speak that contract.

If you edit these files, regenerate `ESP32-S3-WROOM-1-N16R2/components/board_port/src/web_assets.c` (byte arrays) before flashing, or the on-device page will stay stale.
