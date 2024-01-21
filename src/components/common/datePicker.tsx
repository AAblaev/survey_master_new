import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";

const MyDatePicker = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));

  console.log("value", value);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <MuiDatePicker
        views={["year", "month", "day"]}
        value={value}
        onChange={(newValue) => {
          console.log("onChange", newValue);
          setValue(newValue);
        }}
        dayOfWeekFormatter={(_day, weekday) => `${weekday.format("dd")}`}
      />
    </LocalizationProvider>
  );
};

export default MyDatePicker;
