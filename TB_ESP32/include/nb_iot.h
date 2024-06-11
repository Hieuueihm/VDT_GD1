#ifndef NB_IOT_H
#define NB_IOT_H

#include "uart.h"
#include "lcd.h"
enum at_resp
{
    AT_RESP_ERR = 0,
    AT_RESP_OK = 1
};

#define IDLE_MODE 0
#define Regis_Mode 1
const std::string DEVICE_TOKEN = "tsLa6VxwxospaxNH5rht";
const std::string TB_ADDR = "AT+CHTTPCREATE=\"http://demo.thingsboard.io:80\"";
const std::string ATTR = "4163636570743a202a2f2a0d0a436f6e6e656374696f6e3a204b6565702d416c6976650d0a557365722d4167656e743a2053494d434f4d5f4d4f44554c450d0a";
bool SIM7020_init(void);

bool SIM7020_http_init(void);
bool SIM7020_http_send_tb(std::string data_payload);
void SIM7020_http_get_tb(void);
#endif