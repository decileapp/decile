export const hours = Array.from(Array(25).keys()).map((x) => {
  if (x === 0) {
    return {
      name: `Every hour`,
      value: `0`,
    };
  }

  if (x === 24) {
    return {
      name: `00:00`,
      value: `24`,
    };
  }

  return {
    name: `${x}:00`,
    value: `${x}`,
  };
});

const dayLabels = [
  "Every day",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const daysOfWeek = Array.from(Array(8).keys()).map((x) => {
  return {
    name: dayLabels[x],
    value: `${x}`,
  };
});

export const daysOfMonth = Array.from(Array(29).keys()).map((x) => {
  if (x === 0) {
    return {
      name: `Every day`,
      value: `0`,
    };
  }

  return {
    name: `${x}`,
    value: `${x}`,
  };
});
