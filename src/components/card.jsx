/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { BsClouds } from "react-icons/bs";
import { BsCloudHaze2 } from "react-icons/bs";
import { LuCloudRainWind } from "react-icons/lu";
import { BsCloudFog2 } from "react-icons/bs";
import { WiDaySunny } from "react-icons/wi";

const Card = ({ data, isNight, locationTime }) => {
  const [cloudIcon, setCloudIcon] = useState();

  useEffect(() => {
    if (data) {
      if (data?.weather[0]?.main === "Clear") {
        setCloudIcon(<WiDaySunny className="text-7xl shrink-0" />);
      }
      if (data?.weather[0]?.main === "Clouds") {
        setCloudIcon(<BsClouds className="text-7xl shrink-0" />);
      }
      if (data?.weather[0]?.main === "Haze") {
        setCloudIcon(<BsCloudHaze2 className="text-7xl shrink-0" />);
      }
      if (data?.weather[0]?.main === "Rain") {
        setCloudIcon(<LuCloudRainWind className="text-7xl shrink-0" />);
      }
      if (data?.weather[0]?.main === "Foggy") {
        setCloudIcon(<BsCloudFog2 className="text-7xl shrink-0" />);
      }
    }
  }, [data]);

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center gap-y-2 ${
          isNight ? "bg-slate-500/20" : "bg-gray-300/50"
        } rounded-md py-8 backdrop-blur-[2px] shadow-sm`}
      >
        <h1 className="font-semibold text-lg capitalize">{data?.name}</h1>
        {cloudIcon}
        <div className="font-medium text-4xl relative mt-2">
          {Math.floor(data?.main?.temp)}
          <sup className="font-semibold text-lg">o</sup>c
        </div>
        <div className="flex items-center gap-3 ">
          <span className="font-medium text-sm">
            Min : {data?.main?.feels_like}
            <sup className="font-">o</sup>c
          </span>
          <span className="font-medium text-sm">
            Max : {data?.main?.temp_max}
            <sup className="font-">o</sup>c
          </span>
        </div>
        <h1 className="font-semibold text-lg capitalize">
          {data?.weather[0]?.main}
        </h1>
        <span className="font-medium text-sm">Time : {locationTime}</span>
      </div>
    </>
  );
};
export default Card;
