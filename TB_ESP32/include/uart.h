#ifndef UART_H
#define UART_H

#include <HardwareSerial.h>
#include "nb_iot.h"
#include <string>
void uart_begin(void);

void test(void);

bool sendCommand(std::string command, std ::string expected_response, uint32_t time_out, uint8_t num, std::string *actual_resp);
#endif