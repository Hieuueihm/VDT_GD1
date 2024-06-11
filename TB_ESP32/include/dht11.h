#ifndef DHT11_H
#define DHT11_H

#include "DHT.h"
#define DHT11_PIN 15

#define DHT11_SAMPLING_TIME 1000

void dht11_init(void);


bool dht11_read_data(float *temp, float *humi);


#endif