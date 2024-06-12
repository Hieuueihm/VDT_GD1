#include <Arduino.h>
#include "dht11.h"
#include "sensor_processing.h"
#include "uart.h"
#include "lcd.h"

#define TB_SEND_DATA_TIME 10000

float temp = 0;
float humi = 0;
bool valid_data = false;
int currentTime = 0;
bool sim_init_flag = false, http_init_flag = false;
void setup()
{
  pinMode(23, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(19, OUTPUT);
  digitalWrite(23, 1);
  uart_begin();
  lcd_init();

  dht11_init();

  sim_init_flag = SIM7020_init();
  if (sim_init_flag == false)
  {
    Serial.println("SIM init err");
    while (sim_init_flag == false)
    {
      sim_init_flag = SIM7020_init();
    }
  }

  http_init_flag = SIM7020_http_init();
  if (http_init_flag == false)
  {
    Serial.println("HTTP init err");
    while (http_init_flag == false)
    {
      http_init_flag = SIM7020_http_init();
    }
  }
  digitalWrite(2, HIGH);
}

void loop()
{
  SIM7020_http_get_tb();
  if (millis() - currentTime >= TB_SEND_DATA_TIME)
  {
    currentTime = millis();
    if (http_init_flag == true && sim_init_flag == true)
    {
      std::string data_payload = prepare_data();

      bool z = SIM7020_http_send_tb(data_payload);
    }
    else
    {
      Serial.println("not oke");
    }
  }
}
