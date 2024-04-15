import moment from "moment-timezone";

export const getCurrentTime = (countryCode) => {
  if (!countryCode) {
    return { error: "Country code is invalid." };
  }
  const getTimezone = (countryCode) => {
    const countryZones = moment.tz.zonesForCountry(countryCode.toUpperCase());
    if (countryZones.length > 0) {
      return countryZones[0]; // Returning the first timezone found for the country
    } else {
      return null;
    }
  };
  const timezone = getTimezone(countryCode);
  if (timezone) {
    const getCurrentTime = (timezone) => {
      return moment().tz(timezone).format("YYYY-MM-DD HH:mm A");
    };
    const getCurrentHour = (timezone) => {
      return moment().tz(timezone).format("H");
    };

    const currentHour = getCurrentHour(timezone);
    const currentTime = getCurrentTime(timezone);
    return { time: currentTime, hour: currentHour };
  } else {
    return { error: `Timezone not found for ${countryCode}` };
  }
};
