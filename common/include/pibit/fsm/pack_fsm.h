#ifndef PIBIT_PACK_FSM_H
#define PIBIT_PACK_FSM_H

#include "pibit/config.h"
#include "pibit/fsm/cell_fsm.h"

typedef enum {
    PACK_ST_BOOT = 0,
    PACK_ST_IDLE,
    PACK_ST_RUNNING,
    PACK_ST_FAULT,
    PACK_ST_MAINTENANCE
} pack_fsm_state_t;

typedef struct {
    pack_fsm_state_t state;
    cell_ctx_t cells[PIBIT_CELL_COUNT];
    uint32_t pack_fault_mask;
    int32_t pack_voltage_mv;
    int32_t pack_current_ma;
    int32_t ambient_cdeg;
    int32_t humidity_cdeg;
    bool ambient_valid;
} pack_ctx_t;

void pack_fsm_init(pack_ctx_t *pack);
void pack_fsm_step(pack_ctx_t *pack);

#endif // PIBIT_PACK_FSM_H