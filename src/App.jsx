/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import WeatherCard from "./components/card";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [ipLocation, setIpLocation] = useState("second");

  const baseUrl = import.meta.env.VITE_API_URL;

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
      setData(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  // get user ip address
  useEffect(() => {
    const getIpAddress = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://api.ipify.org");
        setIpAddress(res?.data);
      } catch (error) {
        setError(error);
      }
    };
    getIpAddress();
  }, []);
  // get user location
  useEffect(() => {
    if (ipAddress) {
      const getIpLocation = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`http://ip-api.com/json/${ipAddress}`);
          setIpLocation(res?.data?.city);
        } catch (error) {
          setError(error);
        }
      };
      getIpLocation();
    }
  }, [ipAddress]);
  // get weather information
  useEffect(() => {
    if (ipLocation === "second" || !ipLocation) {
      return;
    } else {
      getWeatherInfo(ipLocation);
    }
  }, [ipLocation]);

  const timestamp = data?.sys?.sunset * 1000; // Convert to milliseconds
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const sunset = new Date(timestamp).toLocaleTimeString(undefined, options);

  return (
    <>
      <main className="min-h-screen w-full flex flex-col items-center justify-center px-[5%]">
        <div className="flex gap-x-7 items-center flex-col sm:flex-row gap-y-6">
          <div className="flex flex-col gap-y-5">
            {/* search bar */}
            <div className="flex items-center gap-5">
              <input
                className="w-full h-12 bg-gray-300/50 px-3 rounded-l-sm text-md outline-none "
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
                className="p-2 font-medium rounded-sm outline-none hover:opacity-80 text-xl"
              >
                <FaSearch />
              </button>
            </div>
            {!loading && !error && data && (
              <WeatherCard data={data} city={data?.name || ipLocation} />
            )}
            {/* weather details */}
          </div>
          {/* Highlights */}
          {!loading && !error && data && (
            <div className="flex flex-col">
              <h1 className="font-medium text-lg mb-5">Highlights</h1>
              <div className="grid grid-cols-2 gap-5 w-fit">
                <div className="px-5 py-3 rounded-md bg-gray-300/30 flex items-center flex-col gap-y-1">
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

                <div className="px-5 py-3 rounded-md bg-gray-300/30 flex items-center justify-between flex-col gap-y-1 w-[120px]">
                  <h1 className="font-medium text-md capitalize">Humidity</h1>
                  <span className="flex items-center gap-1">
                    <span className="text-3xl font-bold ">
                      {data?.main?.humidity}
                    </span>
                    <span className="font-semibold text-lg">%</span>
                  </span>
                  <div className="h-3 rounded-3xl w-full bg-gray-500/50 flex items-center justify-center overflow-hidden relative">
                    <div
                      className={`absolute range h-full bg-blue-600 rounded-3xl top-0 left-0`}
                    ></div>
                  </div>
                </div>

                <div className="px-5 py-3 rounded-md bg-gray-300/30 flex items-center justify-between flex-col gap-y-1 w-[120px]">
                  <h1 className="font-medium text-md capitalize">sunset</h1>
                  <span className="flex items-center gap-1">
                    <span className="text-2xl font-semibold whitespace-nowrap ">
                      {sunset}
                    </span>
                  </span>
                </div>
                <div className="px-5 py-3 rounded-md bg-gray-300/30 flex items-center justify-between flex-col gap-y-1 w-[120px]">
                  <h1 className="font-medium text-md capitalize whitespace-nowrap">
                    air pressure
                  </h1>
                  <span className="flex items-center gap-1">
                    <span className="text-3xl font-bold ">
                      {data?.main?.pressure}
                    </span>
                    <sub className="font-semibold text-lg">mb</sub>
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
