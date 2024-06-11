#include "sensor_processing.h"
#include "dht11.h"
#include "lcd.h"
JsonDocument doc;

std::string prepare_data()
{
    std::string data_payload = "";
    float temp = 0;
    float humi = 0;
    bool flag = dht11_read_data(&temp, &humi);
    if (flag == true)
    {

        lcd_display_temp_humi(temp, humi);

        std::ostringstream temp_stream, humi_stream;
        temp_stream << std::fixed << std::setprecision(2) << temp;
        humi_stream << std::fixed << std::setprecision(2) << humi;
        data_payload += '{';
        data_payload += "\"temp\":" + temp_stream.str() + ",";
        data_payload += "\"humi\":" + humi_stream.str();
        data_payload += '}';
    }

    return data_payload;
}