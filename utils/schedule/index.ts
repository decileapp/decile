import { DateTime } from "luxon";
import { Schedule } from "../../types/Schedule";

export const hours = Array.from(Array(23).keys())
  .map((x) => {
    if (x === 0) {
      return {
        name: `00:00`,
        value: `0`,
      };
    }

    const data = {
      name: `${x}:00`,
      value: `${x}`,
    };
    return data;
  })
  .concat({
    name: "Every hour",
    value: "-1",
  });

const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Every day",
];

export const daysOfWeek = Array.from(Array(8).keys()).map((x, id) => {
  if (id === 7) {
    return { name: dayLabels[x], value: "-1" };
  }

  return {
    name: dayLabels[x],
    value: `${x}`,
  };
});

export const daysOfMonth = Array.from(Array(29).keys()).map((x) => {
  if (x === 0) {
    return {
      name: `Every day`,
      value: `-1`,
    };
  }

  return {
    name: `${x}`,
    value: `${x}`,
  };
});

// Format
export const formatSchedule = (s: Schedule) => {
  if (s.periodicity === "hour") {
    return "Every hour";
  }
  const date = DateTime.fromISO(s.timestamp_user_zone);
  if (s.periodicity === "day") {
    return `Every day at ${date.hour}:00`;
  }

  if (s.periodicity === "week") {
    return `Every ${
      daysOfWeek.find((x) => x.value === s.run_at_day.toString())?.name
    } at ${date.hour}:00`;
  }

  if (s.periodicity === "month") {
    return `On the ${date.day} day of every month at ${date.hour}:00`;
  }

  return "";
};
