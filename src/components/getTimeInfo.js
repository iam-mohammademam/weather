import moment from "moment-timezone";

export const getTimeInfo = (timestamp, countryCode) => {
  if (!countryCode || !timestamp) {
    return { error: "Country code or timestamp is invalid." };
  }

  // Find the timezone associated with the country code
  const countryTimezones = moment.tz.zonesForCountry(countryCode.toUpperCase());
  if (!countryTimezones || countryTimezones.length === 0) {
    return { error: `Timezone not found for country code ${countryCode}` };
  }
  const timezone = countryTimezones[0];

  // Convert the timestamp to milliseconds by multiplying by 1000
  const date = new Date(timestamp * 1000);

  // Convert UTC time to the specified timezone
  const localDate = moment(date).tz(timezone);

  // Format the date and time according to the timezone
  const formattedDate = localDate.format("YYYY-MM-DD HH:mm:ss");
  const formattedHour = localDate.format("H");
  const formattedSunTime = localDate.format("HH:mm A");

  return {
    time: formattedDate,
    hour: formattedHour,
    sunTime: formattedSunTime,
  };
};
