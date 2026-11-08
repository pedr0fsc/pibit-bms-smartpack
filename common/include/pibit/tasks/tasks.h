#ifndef PIBIT_TASKS_H
#define PIBIT_TASKS_H

#include "pibit/types.h"

pibit_status_t pibit_tasks_start(void);

void task_acquisition(void *arg);
void task_protection(void *arg);
void task_comms(void*args);
void task_logger(void *arg);

#endif // PIBIT_TASKS_H