import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { ruRU } from "@mui/x-date-pickers/locales";
import { dateParser, dateParserForDayjs } from "../../utils/dateParser";
import { IAnswer, IQuestion } from "../../types";
import { css } from "@emotion/react";
import { validation } from "../../utils/validation";

const ruLocale =
  ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

type IDatePicker = {
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
};

export const datePickerCss = css`
  & .MuiInputBase-root {
    border-radius: 0px;
  }
  & .MuiInputBase-input {
    padding: 10px 0px 10px 10px;
  }
  & .MuiOutlinedInput-notchedOutline {
    border: 0;
  }
`;

const MyDatePicker: React.FC<IDatePicker> = ({
  setAnswer,
  userAnswer,
  question,
}) => {
  const { docID, config } = question;
  const {
    simpleType,
    isSimpleDateLimit,
    simpleDateMax,
    simpleDateMin,
  } = config;

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;

  const value = userAnswerExist
    ? (userAnswer.values as IAnswer["values"])[0].value
    : null;

  const parsedValue = dateParserForDayjs(value);

  const minDate = isSimpleDateLimit
    ? dateParserForDayjs(simpleDateMin!.split(" ")[0])
    : dayjs("1901-01-01");
  const maxDate = isSimpleDateLimit
    ? dateParserForDayjs(simpleDateMax!.split(" ")[0])
    : dayjs("2100-12-31");

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ru"
      localeText={ruLocale}
    >
      <DatePicker
        views={["year", "month", "day"]}
        value={parsedValue}
        onChange={(newValue, context) => {
          // if (context.validationError) {
          //   return;
          // }
          const value_str =
            dateParser(newValue ? newValue.toDate() : null) ?? "";
          // if (!value_str) return;

          const validationResult = validation({
            value: value_str,
            simpleType: "datetime",
            isSimpleDateLimit,
            simpleDateMin,
            simpleDateMax,
          });

          setAnswer({
            questionID: docID,
            values: [
              {
                value: value_str,
                optionID: 0,
                isFocused: false,
                validationResult: validationResult,
              },
            ],
          });
        }}
        dayOfWeekFormatter={(_day, weekday) => `${weekday!.format("dd")}`}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            helperText: "",
            focused: false,
          },
        }}
        css={datePickerCss}
      />
    </LocalizationProvider>
  );
};

export default MyDatePicker;
