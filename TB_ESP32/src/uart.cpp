#include "uart.h"

HardwareSerial AT(1);
void uart_begin()
{
    Serial.begin(115200);
    Serial2.begin(115200);
}
void test()
{

    while (AT.available())
    {
        Serial.print(char(AT.read()));
    }
}

bool sendCommand(std::string command, std ::string expected_response, uint32_t time_out, uint8_t num, std::string *actual_resp)
{

    for (uint32_t i = 1; i <= num; i++)
    {

        Serial2.println(command.c_str());
        Serial.print("Send Command: ");
        std::string resp = "";
        Serial.println(command.c_str());

        int prev_time = millis();
        bool flag = false;

        while ((millis() - prev_time) <= time_out)
        {
            if (Serial2.available())
            {
                char c = Serial2.read();
                resp += c;
                if (resp.find(expected_response) != std::string::npos)
                {
                    flag = true;
                }
            }
            else
            {
                delay(200);
            }
        }

        if (flag == true)
        {
            if (actual_resp != nullptr)
            {
                *actual_resp = resp;
            }
            return AT_RESP_OK;
        }
    }

    return AT_RESP_ERR;
}
