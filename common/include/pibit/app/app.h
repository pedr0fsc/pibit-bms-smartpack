#ifndef PIBIT_APP_H
#define PIBIT_APP_H

#include "pibit/fsm/pack_fsm.h"
#include "pibit/fsm/comm_fsm.h"

typedef struct {
    pack_ctx_t pack;
    comm_ctx_t comm;
} pibit_app_t;



#endif // PIBIT_APP_H