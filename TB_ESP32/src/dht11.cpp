#include "dht11.h"
DHT dht(DHT11_PIN, DHT11);
int dht11_sampling = 0;




void dht11_init(){
    dht.begin();
}

bool dht11_read_data(float *temp, float *humi ){
    if(millis() - dht11_sampling >= DHT11_SAMPLING_TIME){
        dht11_sampling = millis();
         *temp = dht.readTemperature();
        *humi = dht.readHumidity();
        if(isnan(*temp) || isnan(*humi)){
            return false;
        }else{
            return true;
        }
    }
}

