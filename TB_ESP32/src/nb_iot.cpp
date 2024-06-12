#include "nb_iot.h"
#include <sstream>
#include <string>
#include <iomanip>
#include <ArduinoJson.h>

StaticJsonDocument<200> doc1; // <- a little more than 200 bytes in the stack

uint8_t mode = IDLE_MODE;
uint8_t state = 1;

static void SIM7020_start()
{
    digitalWrite(23, 0);
    delay(500);
    digitalWrite(23, 1);
}

static void SIM7020_stop()
{
    digitalWrite(23, 0);
    delay(1500);
    digitalWrite(23, 1);
}

static void SIM7020_restart()
{
    SIM7020_stop();
    delay(5000);
    SIM7020_start();
    delay(5000);
}
bool SIM7020_init()
{

    SIM7020_start();

    //  delay(2000);

    while (1)
    {
        switch (mode)
        {
        case IDLE_MODE:
            switch (state)
            {
            case 1:
                if (sendCommand("AT", "OK", 2000, 5, nullptr) == AT_RESP_OK)
                {
                    state = 2;
                }
                else
                {
                    Serial.println("Err in ST1_IDLE");
                    SIM7020_restart();
                }
                break;
            case 2:
                if (sendCommand("ATE0", "OK", 2000, 5, nullptr) == AT_RESP_OK && sendCommand("AT+CMEE=2", "OK", 2000, 5, nullptr) == AT_RESP_OK)
                {
                    state = 3;
                }
                else
                {
                    Serial.println("Err in ST3_IDLE");
                    state = 1;
                    SIM7020_restart();
                }
                break;
            case 3:
                if (sendCommand("AT+CPIN?", "+CPIN: READY", 2000, 5, nullptr) == AT_RESP_OK)
                {
                    state = 4;
                }
                else
                {
                    state = 1;
                    Serial.println("SIM not found");
                    SIM7020_restart();
                }
                break;
            case 4:
                if (sendCommand("AT+CBAND=3", "OK", 2000, 5, nullptr) == AT_RESP_OK)
                {
                    mode = Regis_Mode;
                    state = 1;
                }
                else
                {
                    Serial.println("Err in ST4_IDLE");
                    state = 1;
                    SIM7020_start();
                }
            }

            break;
        case Regis_Mode:
            switch (state)
            {
            case 1:
                if (sendCommand("AT+CEREG?", "+CEREG: 0,1", 2000, 5, nullptr) == AT_RESP_OK)
                {
                    state = 2;
                }
                else
                {
                    delay(10000);
                    if (sendCommand("AT+CFUN=0", "OK", 2000, 5, nullptr) == AT_RESP_OK && sendCommand("AT*MCGDEFCONT=\"IP\",\"nbiot\"", "OK", 2000, 5, nullptr) == AT_RESP_OK && sendCommand("AT+CFUN=1", "OK", 2000, 5, nullptr) == AT_RESP_OK)
                    {
                        if (sendCommand("AT+CEREG?", "+CEREG: 0,1", 2000, 5, nullptr) == AT_RESP_OK)
                        {
                            state = 2;
                        }
                    }
                    else
                    {
                        SIM7020_restart();
                        state = 1;
                        mode = IDLE_MODE;
                    }
                }
                break;
            case 2:
                if (sendCommand("AT+CGCONTRDP", "+CGCONTRDP:", 2000, 5, nullptr) == AT_RESP_OK)
                {
                    state = 3;
                }
                else
                {
                    Serial.println("Err in ST2_REGIS");
                    SIM7020_restart();
                    state = 1;
                    mode = IDLE_MODE;
                }
                break;
            case 3:
                if (sendCommand("AT+CTZU=1", "OK", 2000, 5, nullptr) == AT_RESP_OK)
                {
                    state = 4;
                }
                else
                {
                    Serial.println("Err in ST3_REGIS");
                    SIM7020_restart();
                    state = 1;
                    mode = IDLE_MODE;
                }
                break;
            case 4:
                if (sendCommand("AT+CENG?", "+CENG:", 2000, 5, nullptr) == AT_RESP_OK)
                {
                    state = 5;
                    return true;
                }
                else
                {
                    Serial.println("Err in ST4_REGIS");
                    SIM7020_restart();
                    state = 1;
                    mode = IDLE_MODE;
                }
                break;
            }
            break;
        }
    }
    return true;
}

static std::string string_to_hex(std::string input)
{
    std::ostringstream hexStream;
    for (char c : input)
    {
        hexStream << std::hex << std::setw(2) << std::setfill('0') << (int)c;
    }
    return hexStream.str();
}

bool SIM7020_http_init()
{
    if (sendCommand(TB_ADDR, "OK", 2000, 10, nullptr) == AT_RESP_OK)
    {
        if (sendCommand("AT+CHTTPCON=0", "OK", 2000, 5, nullptr) == AT_RESP_OK)
        {
            return true;
        }
    }
    return false;
}

bool SIM7020_http_send_tb(std::string data_payload)
{

    std::string hex_payload = string_to_hex(data_payload);

    std::string data_command = "AT+CHTTPSEND=0,1,\"/api/v1/" + DEVICE_TOKEN + "/attributes\"," + ATTR + ",\"application/json\"," + hex_payload;

    if (sendCommand(data_command, "OK", 500, 2, nullptr) == AT_RESP_OK)
    {
        return true;
    }
    return false;
}
static bool isHexChar(char c)
{
    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
}

static std::string removeWhitespace(std::string input)
{
    std::string output;
    output.reserve(input.length());

    for (char c : input)
    {
        if (!isspace(c))
        {
            output.push_back(c);
        }
    }

    return output;
}

static std::string hex_to_string(std::string input)
{
    input = removeWhitespace(input);

    std::string output;
    output.reserve(input.length() / 2);
    for (size_t i = 0; i < input.length(); i += 2)
    {
        if (!isHexChar(input[i]) || !isHexChar(input[i + 1]))
        {
            Serial.println("Invalid hex character detected!");
            return "";
        }
        char byte = std::stoi(input.substr(i, 2), nullptr, 16);
        output.push_back(byte);
    }
    return output;
}
void SIM7020_http_get_tb(void)
{
    std::string get_command = "AT+CHTTPSEND=0,0,\"/api/v1/" + DEVICE_TOKEN + "/attributes\"";
    std::string actual_resp = "";
    if (sendCommand(get_command, "OK", 3000, 1, &actual_resp))
    {
        Serial.println(actual_resp.c_str());

        size_t pos = actual_resp.find("+CHTTPNMIC:");
        if (pos != std::string::npos)
        {
            std::string hexContent = actual_resp.substr(pos + strlen("+CHTTPNMIC:"));

            std::size_t pos1 = hexContent.find(",", hexContent.find(",", hexContent.find(",", hexContent.find(",") + 1) + 1) + 1);
            if (pos1 != std::string::npos)
            {
                std::string newHexContent = hexContent.substr(pos1 + 1);
                std::string jsonFormat = hex_to_string(newHexContent);
                DeserializationError error = deserializeJson(doc1, jsonFormat);
                if (error)
                {
                    Serial.print("deserializeJson() failed: ");
                    Serial.println(error.c_str());
                    return;
                }
                bool ledState = doc1["client"]["led_state"];
                double ledBrightness = doc1["client"]["led_brightness"];
                Serial.println(jsonFormat.c_str());
                lcd_display_led(ledState);
                analogWrite(19, ledState == true ? ledBrightness * 255 : 0);
            }
            else
            {
                Serial.println("Data not found");
            }
        }
        else
        {
            Serial.println("Error: +CHTTPNMIC not found");
        }
    }
    else
    {
        Serial.println("get err");
    }
}
