#ifndef PIBIT_CELL_FSM_H
#define PIBIT_CELL_FSM_H

#include "pibit/types.h"

typedef enum {
    CELL_ST_INIT = 0,
    CELL_ST_STANDBY,   /* wait / bypass: pack stays up via parallel sister */
    CELL_ST_ACTIVE,
    CELL_ST_CHARGE,
    CELL_ST_DISCHARGE,
    CELL_ST_FAULT
} cell_fsm_state_t;

typedef struct {
    uint8_t cell_id;
    cell_fsm_state_t state;
    uint32_t fault_mask;
    int32_t voltage_mv;
    int32_t current_ma;
    int32_t temperature_cdeg;
    uint16_t soc_cdeg;
    uint16_t soh_cdeg;
    pibit_life_stage_t life;
    bool switch_closed;
} cell_ctx_t;

void cell_fsm_init(cell_ctx_t *ctx, uint8_t cell_id);
void cell_fsm_step(cell_ctx_t *ctx);

#endif
