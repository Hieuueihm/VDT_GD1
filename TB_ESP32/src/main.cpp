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
bool y, x;
void setup()
{
  uart_begin();
  lcd_init();

  pinMode(2, OUTPUT);
  pinMode(19, OUTPUT);

  dht11_init();

  x = SIM7020_init();
  if (x == true)
  {
    Serial.println("true");
    y = SIM7020_http_init();
    digitalWrite(2, HIGH);
  }
  else
  {
    Serial.println("false");
  }
}

void loop()
{
  SIM7020_http_get_tb();
  if (millis() - currentTime >= TB_SEND_DATA_TIME)
  {
    currentTime = millis();
    if (y == true && x == true)
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
