#ifndef PIBIT_COMM_FSM_H
#define PIBIT_COMM_FSM_H

#include "pibit/types.h"

typedef enum {
    COMM_ST_OFFLINE = 0,
    COMM_ST_WIFI_CONNECTING,
    COMM_ST_MQTT_CONNECTING,
    COMM_ST_ONLINE,
    COMM_ST_BUFFERING
} comm_fsm_state_t;

typedef struct {
    comm_fsm_state_t state;
    uint32_t last_ok_ms;
    uint32_t buffered;
} comm_ctx_t;

void comm_fsm_init(comm_ctx_t *ctx);
void comm_fsm_step(comm_ctx_t *ctx);

#endif
