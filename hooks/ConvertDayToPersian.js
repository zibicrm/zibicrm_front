const convertDay = (day) => {
  switch (day) {
    case "Saturday":
      return "شنبه";
    case "Sunday":
      return "یکشنبه";
    case "Monday":
      return "دوشنبه";
    case "Tuesday":
      return "سه شنبه";
    case "Wednesday":
      return "چهارشنبه";
    case "Thursday":
      return "پنج شنبه";
    case "Friday":
      return "جمعه";
  }
};
export default convertDay;
