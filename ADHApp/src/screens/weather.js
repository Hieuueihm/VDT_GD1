import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { COLORS, ROUTES } from "../../constants";
import { TouchableOpacity, ScrollView } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Image } from "react-native";
import UVLine from "./UVLine";
import Feather from "react-native-vector-icons/Feather";
import ParabolaCurve from "./Parabol";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";

import { fetchWeatherForecast, fetchLocations } from "../api/weatherAPI";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
export default function WeatherScreen() {
  const navigation = useNavigation();
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [selectedTab, setSelectedTab] = useState("hourly");
  const scrollViewRef = useRef();
  const [scrollViewIsSet, setScrollViewIsSet] = useState(null);

  const handleScroll = (tab) => {
    let currentIndex = -1;
    if (tab === "hourly") {
      currentIndex = new Date().getHours();

      if (currentIndex !== -1) {
        const scrollPosition = currentIndex * (80 + 12); // Adjust 80 and 12 based on your item width and margin
        scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
      }
    } else {
      scrollViewRef.current.scrollTo({ x: 0, animated: false });
    }
  };
  useEffect(() => {
    fetchLocations({ cityName: "Hanoi" }).then((data) => {
      setLocations(data[0].name);
    });
    fetchWeatherForecast({ cityName: "Hanoi", days: "7" }).then((data) => {
      setWeather(data);
    });
  }, []);

  useEffect(() => {
    // Gọi handleScroll('hourly') khi ScrollView được tạo

    if (scrollViewRef.current) {
      setScrollViewIsSet(true); // Đánh dấu rằng ScrollView đã được thiết lập
      handleScroll("hourly"); // Gọi handleScroll
    }
  }, []);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    handleScroll(tab);
  };
  const handleAstro = (time) => {
    if (time) {
      let parts = time.split(":");

      if (parts[0].startsWith("0")) {
        parts[0] = parts[0].substr(1);
      }

      let result = parts.join(":");
      return result;
    } else {
      return "";
    }
  };

  const time12 = (timeString) => {
    const time = new Date(timeString);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedTime = `${formattedHours} ${period}`;
    return formattedTime;
  };

  if (weather) {
    var { current, location, forecast } = weather;
    var hourly = forecast?.forecastday[1];
  }
  // const { current, location, forecast } = weather;
  // const hourly = forecast?.forecastday[1];
  if (scrollViewIsSet == true) {
    handleScroll("hourly");
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.weatherBgColor }}>
      {/*header*/}

      <SafeAreaView
        style={{
          flexDirection: "row",
          marginTop: screenHeight / 15,
          marginBottom: screenHeight / 50,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(ROUTES.HOMESCREEN);
          }}
        >
          <Ionicon
            name={"chevron-back"}
            style={{
              fontSize: 30,
              color: COLORS.black,
              marginLeft: screenWidth / 20,
              opacity: 1,
            }}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginLeft: screenWidth / 4.5 }}>
          <MaterialCommunityIcon
            name={"map-marker-outline"}
            style={{
              fontSize: 30,
              color: COLORS.white,
              marginRight: screenWidth / 80,
            }}
          />
          <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: 400 }}>
            {locations}
          </Text>
          <Ionicon
            name={"chevron-down"}
            style={{
              marginTop: screenHeight / 150,
              fontSize: 20,
              color: COLORS.white,
              opacity: 1,
            }}
          />
        </View>
      </SafeAreaView>

      {/*image weather*/}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          margin: 0,
          maxHeight: screenHeight / 5,
        }}
      >
        <Image
          source={{ uri: `https:${current?.condition.icon}` }}
          style={{
            marginLeft: 0,
            width: screenWidth / 2,
            height: screenHeight / 4,
            resizeMode: "contain",
          }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 50,
            fontWeight: "500",
          }}
        >
          {current?.temp_c}
          {"\u2103"}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 18,
              textAlign: "center", // Căn giữa văn bản
            }}
          >
            {current?.condition?.text}
          </Text>
          <View
            style={{ justifyContent: "center", flex: 1, flexDirection: "row" }}
          >
            <View
              style={{
                flexDirection: "row",
                textAlign: "space-around", // Căn giữa các phần tử
                marginTop: screenHeight / 100, // Tạo khoảng cách giữa hai dòng văn bản
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  paddingHorizontal: screenWidth / 50,
                }}
              >
                Max: {forecast?.forecastday[0]?.day?.maxtemp_c}
                {"\u2103"}
              </Text>
              <Text style={{ color: COLORS.white, fontSize: 16 }}>
                Min: {forecast?.forecastday[0]?.day?.mintemp_c}
                {"\u2103"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/*rain, humidity*/}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.bgWheather3,
            width: "85%",
            marginTop: screenHeight / 50,
            borderRadius: 10,
            height: screenHeight / 15,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                marginTop: screenHeight / 60,
                marginLeft: screenWidth / 20,
              }}
            >
              <Image source={require("../assets/icons/noun-rain.png")} />
              <Text style={styles.text1}>
                {forecast?.forecastday[0]?.day?.daily_chance_of_rain}%
              </Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1, marginTop: 11 }}>
              <Image source={require("../assets/icons/noun-humidity.png")} />
              <Text style={styles.text1}>{current?.humidity}%</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1, marginTop: 11 }}>
              <Image source={require("../assets/icons/noun-wind.png")} />
              <Text style={styles.text1}>{current?.wind_kph} km/h</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            backgroundColor: COLORS.bgWheather3,
            width: "85%",
            marginTop: screenHeight / 80,
            borderRadius: 20,
            height: screenHeight / 3.8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: screenHeight / 100,
            }}
          >
            <TouchableOpacity onPress={() => handleTabClick("hourly")}>
              <Text style={{ color: COLORS.white, fontSize: 16 }}>
                Hourly Forecast
              </Text>
              <View
                style={{
                  borderBottomWidth: selectedTab === "hourly" ? 2 : 0,
                  borderBottomColor:
                    selectedTab === "hourly"
                      ? COLORS.bgWheather1
                      : "transparent",
                }}
              ></View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleTabClick("weekly")}>
              <Text style={{ color: COLORS.white, fontSize: 16 }}>
                Weekly Forecast
              </Text>
              <View
                style={{
                  borderBottomWidth: selectedTab === "weekly" ? 2 : 0,
                  borderBottomColor:
                    selectedTab === "weekly"
                      ? COLORS.bgWheather1
                      : "transparent",
                }}
              ></View>
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 0,
              marginTop: screenHeight / 100,
            }} // Thêm padding ngang để tạo khoảng cách
            onLayout={() => {
              if (!scrollViewIsSet) {
                setScrollViewIsSet(true); // Đảm bảo rằng ScrollView đã được thiết lập
                handleScroll("hourly"); // Gọi handleScroll khi ScrollView đã thiết lập
              }
            }}
          >
            {selectedTab === "hourly"
              ? hourly?.hour.map((item, index) => {
                  const isCurrentHour =
                    new Date().getHours() === new Date(item?.time).getHours();
                  return (
                    <View
                      style={{
                        width: screenWidth / 4.9,
                        alignItems: "center",
                        marginRight: screenWidth / 33,
                        borderWidth: isCurrentHour ? 2 : 0,
                        borderColor: isCurrentHour
                          ? COLORS.weatherBorder
                          : "transparent",
                        borderRadius: 20,
                        backgroundColor: isCurrentHour
                          ? COLORS.bgWheather4
                          : "transparent",
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 30,
                          paddingVertical: screenHeight / 120,
                          marginBottom: screenHeight / 100,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: COLORS.white,
                          }}
                        >
                          {item?.temp_c}
                          {"\u2103"}
                        </Text>
                      </View>
                      <Image
                        source={{
                          uri: `https:${item?.condition?.icon}`,
                          width: screenWidth / 5,
                          height: screenHeight / 10,
                        }}
                        style={{
                          marginBottom: screenHeight / 120,
                          marginTop: -screenHeight / 80,
                        }} // Điều chỉnh kích thước của ảnh
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: COLORS.white,
                          marginTop: -screenHeight / 80,
                          fontWeight: "bold",
                        }}
                      >
                        {isCurrentHour ? "NOW" : time12(item?.time)}
                      </Text>
                    </View>
                  );
                })
              : forecast?.forecastday?.map((item, index) => {
                  const date = new Date(item.date);
                  const options = { weekday: "long" };
                  let dayName = date.toLocaleDateString("en-US", options);
                  dayName = dayName.split(",")[0];
                  const isCurrentDate =
                    new Date().toLocaleDateString() ===
                    date.toLocaleDateString();
                  return (
                    <View
                      style={{
                        width: screenWidth / 5,
                        alignItems: "center",
                        marginRight: screenWidth / 80,
                        borderWidth: isCurrentDate ? 2 : 0,
                        borderColor: isCurrentDate
                          ? COLORS.weatherBorder
                          : "transparent",
                        borderRadius: 20,
                        backgroundColor: isCurrentDate
                          ? COLORS.bgWheather4
                          : "transparent",
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 30,
                          paddingVertical: screenWidth / 100,
                          marginBottom: screenHeight / 80,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: COLORS.white,
                          }}
                        >
                          {item?.day?.avgtemp_c}
                          {"\u2103"}
                        </Text>
                      </View>
                      <Image
                        source={{
                          uri: `https:${item?.day?.condition?.icon}`,
                          width: screenHeight / 10,
                          height: screenWidth / 5,
                        }}
                        style={{
                          marginBottom: screenHeight / 100,
                          marginTop: -screenHeight / 80,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: COLORS.white,
                          marginTop: -screenHeight / 80,
                          fontWeight: "bold",
                        }}
                      >
                        {isCurrentDate ? "TODAY" : dayName}
                      </Text>
                    </View>
                  );
                })}
          </ScrollView>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: COLORS.bgWheather2,
            width: "40%",
            marginTop: screenHeight / 50,
            borderRadius: 30,
            height: screenHeight / 4.8,
            marginLeft: screenWidth / 12,
            marginRight: screenHeight / 32,
            borderColor: COLORS.borderUVColor,
            borderWidth: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: screenWidth / 30,
              marginTop: screenHeight / 80,
            }}
          >
            <MaterialCommunityIcon
              name={"white-balance-sunny"}
              style={{
                fontSize: 20,
                color: COLORS.bgWhite(0.7),
                marginRight: screenWidth / 100,
              }}
            />
            <Text
              style={{
                color: COLORS.bgWhite(0.7),
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              UV INDEX
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: screenWidth / 20,
              marginTop: screenWidth / 100,
              marginBottom: screenWidth / 30,
            }}
          >
            <Text
              style={{
                color: COLORS.bgWhite(0.9),
                fontSize: 28,
                fontWeight: "bold",
              }}
            >
              {forecast?.forecastday[0]?.day?.uv}{" "}
            </Text>
            <Text
              style={{
                color: COLORS.bgWhite(0.9),
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {forecast?.forecastday[0]?.day?.uv !== undefined
                ? forecast?.forecastday[0]?.day?.uv <= 2
                  ? "Safe"
                  : forecast?.forecastday[0]?.day?.uv <= 7
                  ? "Moderate"
                  : "Danger"
                : null}
            </Text>
          </View>
          <UVLine uvIndex={forecast?.forecastday[0]?.day?.uv} />
        </View>

        <View
          style={{
            backgroundColor: COLORS.bgWheather2,
            width: "40%",
            marginTop: 12,
            borderRadius: 30,
            height: screenHeight / 4.8,
            borderColor: COLORS.borderUVColor,
            borderWidth: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: screenWidth / 30,
              marginTop: screenHeight / 80,
            }}
          >
            <Feather
              name={"sunrise"}
              style={{
                color: COLORS.bgWhite(0.7),
                fontSize: 18,
                marginRight: screenWidth / 120,
              }}
            />
            <Text
              style={{
                color: COLORS.bgWhite(0.7),
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              SUNRISE
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: -screenHeight / 200,
            }}
          >
            <Text
              style={{ color: COLORS.white, fontWeight: "bold", fontSize: 26 }}
            >
              {handleAstro(forecast?.forecastday[0]?.astro?.sunrise)}
            </Text>
          </View>
          <ParabolaCurve />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: screenHeight / 16,
            }}
          >
            <Text
              style={{
                color: COLORS.bgWhite(0.7),
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              Sunset: {handleAstro(forecast?.forecastday[0]?.astro?.sunset)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text1: {
    color: COLORS.white,
    marginLeft: screenWidth / 120,
    marginTop: screenHeight / 160,
    fontWeight: "bold",
  },
});
