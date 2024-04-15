/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import WeatherCard from "./components/card";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { getCurrentTime } from "./getCurrentTime";
import { getSunTime } from "./components/getSunTime";

const baseUrl = import.meta.env.VITE_API_URL;

const App = () => {
  const [inputValue, setInputValue] = useState("");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isNight, setIsNight] = useState(false);
  const [locationTime, setLocationTime] = useState(null);
  const [isSunset, setIsSunset] = useState(false);
  const [sunTime, setSunTime] = useState("");

  const getWeatherInfo = async (location) => {
    if (!location) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/weather?q=${location}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`
      );
      setError(null);
      setData(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
    if (new Date().getHours() >= 19 || new Date().getHours() <= 7) {
      setIsNight(true);
    } else {
      setIsNight(false);
    }
  }, []);
  // get user weather information
  useEffect(() => {
    if (latitude && longitude) {
      const getUserLocationWeather = async () => {
        try {
          const res = await axios.get(
            `${baseUrl}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${
              import.meta.env.VITE_APP_ID
            }`
          );
          setError(null);
          setData(res.data);
        } catch (error) {
          console.log(error);
          setError(error);
        }
      };
      getUserLocationWeather();
    } else {
      getWeatherInfo("dhaka");
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // get current time with timezone
    const getTime = getCurrentTime(data?.sys?.country);
    setLocationTime(getTime.time);
    if (getTime.hour >= 19 || getTime.hour <= 6) {
      const formattedDate = getSunTime(data?.sys?.sunrise, data?.sys?.country);
      setSunTime(formattedDate.time);
      setIsSunset(true);
    } else {
      const formattedDate = getSunTime(data?.sys?.sunset, data?.sys?.country);
      setSunTime(formattedDate.time);
      setIsSunset(false);
    }
    // set humidity percentage
    const humidity = document.querySelector(".humidity");
    if (data && humidity) {
      humidity.style.width = data?.main?.humidity + "%";
    }
  }, [data]);

  // console.log(data);
  return (
    <>
      <main
        className={`min-h-screen w-full flex flex-col items-center justify-center px-[10%] overflow-hidden ${
          isNight ? "bg-black text-white" : ""
        }`}
      >
        <div className="flex gap-x-7 items-center flex-col sm:flex-row  overflow-hidden gap-y-6">
          <div className="flex flex-col gap-y-5 w-full">
            {/* search bar */}
            <div className="flex items-center gap-5">
              <input
                className={`w-full h-12 ${
                  isNight ? "bg-slate-500/20" : "bg-gray-300/50"
                } px-3 rounded-l-sm text-md outline-none`}
                value={inputValue}
                placeholder="Search by city name"
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue) {
                    getWeatherInfo(inputValue);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (inputValue) {
                    getWeatherInfo(inputValue);
                  }
                }}
                className="p-2 font-medium rounded-sm outline-none hover:opacity-80 text-xl w-fit shrink-0"
              >
                <FaSearch />
              </button>
            </div>
            {!loading && !error && data && (
              <WeatherCard
                data={data}
                locationTime={locationTime}
                isNight={isNight}
              />
            )}
            {/* weather details */}
          </div>

          {/* Highlights */}
          {!loading && !error && data && (
            <div className="flex flex-col w-full items-center justify-center overflow-hidden">
              <h1 className="font-medium text-lg mb-5 mr-auto">Highlights</h1>
              <div className="grid grid-cols-2 gap-5 w-full">
                {/* wind speed */}
                <div
                  className={`px-5 py-3 rounded-md shrink-0 ${
                    isNight ? "bg-slate-500/20" : "bg-gray-300/50"
                  } flex items-center flex-col gap-y-1 backdrop-blur-[2px]`}
                >
                  <h1 className="font-medium text-md capitalize">Wind speed</h1>
                  <span className="flex items-center gap-1">
                    <span className="text-2xl font-semibold ">
                      {data?.wind?.speed}
                    </span>
                    <span className="font-semibold">km/h</span>
                  </span>

                  <span className="flex items-center gap-1 font-semibold">
                    <VscSend className="text-lg" />N
                  </span>
                </div>
                {/* humidity */}
                <div
                  className={`w-full px-5 py-3 rounded-md  ${
                    isNight ? "bg-slate-500/20" : "bg-gray-300/50"
                  } flex items-center justify-between flex-col gap-y-1 backdrop-blur-[2px]`}
                >
                  <h1 className="font-medium text-md capitalize">Humidity</h1>
                  <span className="flex items-center gap-1">
                    <span className="text-3xl font-bold ">
                      {data?.main?.humidity}
                    </span>
                    <span className="font-semibold text-lg">%</span>
                  </span>
                  <div className="h-3 rounded-3xl w-full bg-gray-500/50 flex items-center justify-center overflow-hidden relative">
                    <div
                      className={`absolute h-full humidity bg-amber-400 rounded-3xl top-0 left-0`}
                    ></div>
                  </div>
                </div>
                {/* sunset & sunrise */}
                <div
                  className={`w-full rounded-md px-5 py-3 backdrop-blur-[2px]  ${
                    isNight ? "bg-slate-500/20" : "bg-gray-300/50"
                  } flex items-center justify-between flex-col gap-y-1`}
                >
                  <h1 className="font-medium text-md capitalize">
                    {isSunset ? "sunrise" : "sunset"}
                  </h1>
                  <span className="flex items-center gap-1">
                    <span className="text-2xl font-semibold whitespace-nowrap ">
                      {sunTime > 12 ? sunTime - 12 : sunTime}
                    </span>
                  </span>
                </div>
                {/* air pressure */}
                <div
                  className={`w-full rounded-md px-5 py-3 backdrop-blur-[2px] shrink-0 ${
                    isNight ? "bg-slate-500/20" : "bg-gray-300/50"
                  } flex items-center justify-between flex-col gap-y-1`}
                >
                  <h1 className="font-medium text-md capitalize whitespace-nowrap">
                    air pressure
                  </h1>
                  <span className="flex items-center gap-1">
                    <span className="text-3xl font-bold ">
                      {data?.main?.pressure}
                    </span>
                    <sub className="font-semibold text-lg">hPa</sub>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {loading ? (
          <>
            <div className="mt-10">
              <iframe
                src="https://giphy.com/embed/3o7TKNOYAv36eKJJra"
                width="100%"
                height="100%"
                frameBorder="0"
                className="giphy-embed"
                allowFullScreen
              ></iframe>
            </div>
          </>
        ) : (
          error && (
            <>
              <div className="flex items-center justify-center flex-col mt-10">
                <h1 className="font-medium text-lg">
                  Didn&apos;t find any result for{" "}
                  <span className="underline">{inputValue}</span>.
                </h1>
                <small className="font-medium mt-3">Try something else .</small>
              </div>
            </>
          )
        )}
      </main>
    </>
  );
};
export default App;
