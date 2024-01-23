import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import { ruRU } from "@mui/x-date-pickers/locales";
import { dateParser, dateParserForDayjs } from "../../utils/dateParser";
import { IAnswer, IQuestion } from "../../types";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { borderColorCss } from "../questions/views/free-list";

const ruLocale =
  ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

type IDatePicker = {
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
};

const MyDatePicker: React.FC<IDatePicker> = ({
  setAnswer,
  userAnswer,
  question,
}) => {
  const { docID, config } = question;
  const {
    isMultiline,
    simpleType,
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
    isSimpleDateLimit,
    simpleDateMax,
    simpleDateMin,
  } = config;
  console.log("config", config);

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const validationMessage = userAnswerExist
    ? userAnswer.values[0].validationResult.message
    : "";
  const value = userAnswerExist
    ? (userAnswer.values as IAnswer["values"])[0].value
    : null;

  const parsedValue = dateParserForDayjs(value);
  const [selfValue, setSelfValue] = React.useState<Dayjs | null>(parsedValue);

  const minDate = isSimpleDateLimit
    ? dateParserForDayjs(simpleDateMin!.split(" ")[0])
    : dayjs("1901-01-01");
  const maxDate = isSimpleDateLimit
    ? dateParserForDayjs(simpleDateMax!.split(" ")[0])
    : dayjs("1901-01-01");

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ru"
      localeText={ruLocale}
    >
      <DatePicker
        views={["year", "month", "day"]}
        value={selfValue}
        onChange={(newValue, context) => {
          if (context.validationError) {
            return;
          }
          console.log("onChange");
          const value_str =
            dateParser(newValue ? newValue.toDate() : null) ?? "";
          // if (!value_str) return;
          // setAnswer({
          //   questionID: docID,
          //   values: [
          //     {
          //       value: value_str,
          //       optionID: 0,
          //       isFocused: true,
          //       validationResult: { isValid: true, message: "ошибка" },
          //     },
          //   ],
          // });
          setSelfValue(newValue);
          // setValue(dateParser(newValue ? newValue.toDate() : null));
        }}
        dayOfWeekFormatter={(_day, weekday) => `${weekday!.format("dd")}`}
        minDate={minDate}
        maxDate={maxDate}
        slots={{
          textField: (textFieldProps) => (
            <TextField
              {...textFieldProps}
              css={borderColorCss(false)}
              InputProps={{}}
            />
          ),
        }}
      />
    </LocalizationProvider>
  );
};

export default MyDatePicker;
