#ifndef PIBIT_TYPES_H
#define PIBIT_TYPES_H

#include <stdbool.h>
#include <stdint.h>
#include <stddef.h>

typedef int32_t pibit_status_t;

#define PIBIT_OK 0
#define PIBIT_ERR -1
#define PIBIT_ERR_TIMEOUT -2
#define PIBIT_ERR_BUSY -3
#define PIBIT_ERR_PARAM -4
#define PIBIT_ERR_IO -5
#define PIBIT_ERR_NOMEM -6
#define PIBIT_ERR_STATE -7

// Battery life stage definitions
typedef enum {
    PIBIT_CELL_LIRE_FLB = 0, // First life: ~100% to 70-80%
    PIBIT_CELL_LIFE_SLB,     /* Second life: 70-80% to ~50-60% */
    PIBIT_CELL_LIFE_TLB      /* Third life: below ~50% */
} pibit_life_stage_t;

// Fault mask definitions (bitmask error flags)
typedef enum {
    PIBIT_FAULT_NONE          = 0,
    PIBIT_FAULT_OVERVOLTAGE   = (1u << 0),
    PIBIT_FAULT_UNDERVOLTAGE  = (1u << 1),
    PIBIT_FAULT_OVERCURRENT   = (1u << 2),
    PIBIT_FAULT_OVERTEMP      = (1u << 3),
    PIBIT_FAULT_UNDERTEMP     = (1u << 4),
    PIBIT_FAULT_SENSOR        = (1u << 5),
    PIBIT_FAULT_COMM          = (1u << 6)
} pibit_fault_mask_t;

typedef struct {
    uint8_t cell_id;
    int32_t voltage_mv;
    int32_t current_ma;
    int32_t temperature_cdeg; /* centi-degrees: 2510 => 25.10 C */
    int32_t ambient_cdeg;
    int32_t humidity_cdeg;    /* centi-percent RH */
    uint16_t soc_cdeg;        /* centi-percent: 8010 => 80.10% */
    uint16_t soh_cdeg;
    uint32_t fault_mask;
    uint8_t  cell_state;
    uint8_t  pack_state;
    uint8_t  life;
    uint32_t timestamp_ms;
} pibit_telemetry_t;

#endif