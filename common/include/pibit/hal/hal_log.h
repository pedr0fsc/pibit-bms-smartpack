#ifndef PIBIT_HAL_LOG_H
#define PIBIT_HAL_LOG_H

void hal_log_error(const char *tag, const char *format, ...);
void hal_log_warning(const char *tag, const char *format, ...);
void hal_log_info(const char *tag, const char *format, ...);
void hal_log_debug(const char *tag, const char *format, ...);

#endif // PIBIT_HAL_LOG_H