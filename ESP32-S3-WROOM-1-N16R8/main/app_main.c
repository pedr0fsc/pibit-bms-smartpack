#include "pibit/app/app.h"
#include "pibit/hal/hal_log.h"
#include "pibit/tasks/tasks.h"
#include "pibit/version.h"

#define TAG "main"

void app_main(void) {
    hal_log_info(TAG, "Pibit-BMS %s starting on ESP32-S3-WROOM-1-N16R8", PIBIT_VERSION_STRING);
    
    pibit_status_t st = pibit_app_init();
    if(st != 0) {
        hal_log_error(TAG, "app init failed (%d)", (int)st);
        return;
    }

    st = pibit_tasks_start();
    if(st != PIBIT_OK) {
        hal_log_error(TAG, "tasks start failed (%d)", (int)st);
        return;
    }

    hal_log_info(TAG, "runtime started (core0 comms, core1 acquire/protect)");
}