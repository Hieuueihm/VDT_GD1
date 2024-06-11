#ifndef LCD_H
#define LCD_H

#include <LiquidCrystal_I2C.h>
#define LCD_COLUMNS 16
#define LCD_ROWS 2
#define LCD_ADDRESS 0x27

void lcd_init(void);
void lcd_display_temp_humi(float temp, float humi);
void lcd_display_led(int led_state);
#endif