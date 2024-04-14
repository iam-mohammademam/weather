/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import WeatherCard from "./components/card";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";

const App = () => {
  const [inputValue, setInputValue] = useState("dhaka");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;

  const getWeatherInfo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/weather?q=${inputValue}&units=metric&appid=51c1b9373eaf6c25c3152773a88b8c25`
      );
      setData(res.data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!baseUrl) {
      return console.log("Invalid api url.");
    }
    getWeatherInfo();
  }, []);

  const timestamp = data?.sys?.sunset * 1000; // Convert to milliseconds
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const sunset = new Date(timestamp).toLocaleTimeString(undefined, options);

  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center flex-col ">
        <div className="flex gap-x-7 items-center">
          <div className="flex flex-col gap-y-5">
            {/* search bar */}
            <div className="flex items-center gap-5">
              <input
                className="w-full h-12 bg-gray-300/50 px-3 rounded-l-sm text-md outline-none "
                value={inputValue}
                placeholder="Search by city name"
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    getWeatherInfo();
                  }
                }}
              />
              <button
                onClick={getWeatherInfo}
                className="h-full font-medium rounded-sm outline-none text- text-xl"
              >
                <FaSearch />
              </button>
            </div>
            {!loading && data && <WeatherCard data={data} />}
            {/* weather details */}
          </div>
          {/* Highlights */}
          {!loading && data && (
            <div className="flex flex-col">
              <h1 className="font-medium text-lg mb-5">
                Today&apos;s Highlights
              </h1>
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
                  <h1 className="font-medium text-md capitalize">
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
        {loading && (
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
        )}
      </main>
    </>
  );
};
export default App;
