import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import { ruRU } from "@mui/x-date-pickers/locales";

const ruLocale =
  ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

const MyDatePicker = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));

  console.log("value", value);
  console.log("test", dayjs("22.02.2001"));

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ru"
      localeText={ruLocale}
    >
      <MuiDatePicker
        views={["year", "month", "day"]}
        value={value}
        onChange={(newValue, context) => {
          console.log("newValue", newValue);
          console.log("context", context);

          setValue(newValue);
        }}
        dayOfWeekFormatter={(_day, weekday) => `${weekday.format("dd")}`}
      />
    </LocalizationProvider>
  );
};

export default MyDatePicker;
