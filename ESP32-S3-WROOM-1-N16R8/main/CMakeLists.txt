idf_component_register(
    SRCS "app_main.c"
    INCLUDE_DIRS "."
    REQUIRES pibit_commmon board_port log
)