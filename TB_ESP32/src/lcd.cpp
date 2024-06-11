#include "lcd.h"

LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);

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

    lcd.setCursor(2, 0);
    lcd.print(temp);
    lcd.setCursor(10, 0);
    lcd.print(humi);
}
void lcd_display_led(int led_state)
{
    lcd.setCursor(5, 1);
    lcd.print(led_state == HIGH ? "ON " : "OFF");
}