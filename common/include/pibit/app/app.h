#ifndef PIBIT_APP_H
#define PIBIT_APP_H

#include "pibit/fsm/pack_fsm.h"
#include "pibit/fsm/comm_fsm.h"

typedef struct {
    pack_ctx_t pack;
    comm_ctx_t comm;
} pibit_app_t;

pibit_app_t *pibit_app_instance(void);
pibit_status_t pibit_app_init(void);
void pibit_app_lock(void);
void pibit_app_unlock(void);

#endif // PIBIT_APP_H