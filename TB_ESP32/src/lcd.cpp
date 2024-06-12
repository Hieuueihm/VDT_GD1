#include "lcd.h"

LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);

float prev_humi = 0, prev_temp = 0;
int prev_led_state = -1;
void lcd_init()
{
    lcd.init();
    lcd.backlight();

    lcd.setCursor(0, 0);
    lcd.print("T:");
    lcd.setCursor(7, 0);
    lcd.print(" H:");
    lcd.setCursor(0, 1);

    lcd.print("LED: ");
}
void lcd_display_temp_humi(float temp, float humi)
{
    if (temp != prev_temp)
    {
        lcd.setCursor(2, 0);
        lcd.print(temp);
        prev_temp = temp;
    }
    if (humi != prev_humi)
    {
        lcd.setCursor(10, 0);
        lcd.print(humi);
    }
}
void lcd_display_led(int led_state)
{
    if (prev_led_state != led_state)
    {
        lcd.setCursor(5, 1);
        lcd.print(led_state == HIGH ? "ON " : "OFF");
        prev_led_state = led_state;
    }
}