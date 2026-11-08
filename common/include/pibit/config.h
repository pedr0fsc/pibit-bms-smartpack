#ifndef PIBIT_CONFIG_H
#define PIBIT_CONFIG_H

#include "pibit/types.h"

// Prototype SmartPack: 4 cells. Chemistry NMC (charge 4.2 V, cutoff 2.5 V).

#ifndef PIBIT_CELL_COUNT
#define PIBIT_CELL_COUNT 4
#endif

#ifndef PIBIT_V_MAX_MV
#define PIBIT_V_MAX_MV 4200
#endif

#ifndef PIBIT_V_MIN_MV
#define PIBIT_V_MIN_MV 2500
#endif

#endif // PIBIT_CONFIG_H