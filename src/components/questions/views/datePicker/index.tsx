import React from "react";
import { IAnswer, IQuestion } from "../../../../types";
import { validation } from "../../../../utils/validation";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import { alertCss, textFieldWrapperCss } from "../free-list";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { ruRU } from "@mui/x-date-pickers/locales";
import { css } from "@emotion/react";
import {
  dateParser,
  dateParserForDayjs,
  getDateRange,
} from "../../../../utils/dateParser";
import { IViewComponentProps } from "../..";

const ruLocale =
  ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

export const datePickerCss = css`
  & .MuiInputBase-root {
    border-radius: 0px;
  }
  & .MuiInputBase-input {
    padding: 12px 0px 12px 12px;
  }
  & .MuiOutlinedInput-notchedOutline {
    border: 0;
  }
`;

const DatePicker: React.FC<IViewComponentProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const { isSimpleDateLimit, simpleDateMax, simpleDateMin, dateType } = config;

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const showAlert =
    userAnswerExist &&
    !userAnswer.values[0].validationResult.isValid &&
    !userAnswer.values[0].isFocused;

  const validationMessage = userAnswerExist
    ? userAnswer.values[0].validationResult.message
    : "";
  const value = userAnswerExist
    ? (userAnswer.values as IAnswer["values"])[0].value
    : null;

  const parsedValue = dateParserForDayjs(value);

  // const minDate = isSimpleDateLimit
  //   ? dateParserForDayjs(simpleDateMin!.split(" ")[0])
  //   : dayjs("1000-01-01");
  // const maxDate = isSimpleDateLimit
  //   ? dateParserForDayjs(simpleDateMax!.split(" ")[0])
  //   : dayjs("2100-12-31");

  const [minDate, maxDate] = getDateRange({
    isSimpleDateLimit,
    dateType: dateType as number,
    simpleDateMax,
    simpleDateMin,
  });

  console.log();
  const onChange = (newValue: dayjs.Dayjs | null) => {
    const value_str = dateParser(newValue ? newValue.toDate() : null) ?? "";

    if (
      userAnswerExist &&
      (userAnswer.values as IAnswer["values"])[0].isFocused
    )
      return;

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
  };

  const handleFocus = (e: any) => {
    const isValid =
      userAnswerExist && userAnswer.values[0].validationResult.isValid;
    setAnswer({
      questionID: docID,
      values: [
        {
          value: value ? value : "",
          optionID: 0,
          isFocused: true,
          validationResult: { isValid: isValid, message: "ошибка" },
        },
      ],
    });
  };

  const handleBlur = (e: any) => {
    const value = e.target.value;
    if (value === "ДД.ММ.ГГГГ") {
      setAnswer({
        questionID: docID,
        values: [],
      });
      return;
    }
    const validationResult = validation({
      value,
      simpleType: "datetime",
      isSimpleDateLimit: true,
      simpleDateMin,
      simpleDateMax,
    });

    const needChangeValue =
      validationResult.message !== "допустимый формат дд.мм.гггг";
    setAnswer({
      questionID: docID,
      values: [
        {
          value: needChangeValue ? value : "",
          optionID: 0,
          isFocused: false,
          validationResult,
        },
      ],
    });
  };

  return (
    <div css={textFieldWrapperCss}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="ru"
        localeText={ruLocale}
      >
        <MuiDatePicker
          views={["year", "month", "day"]}
          value={parsedValue}
          onChange={(newValue) => onChange(newValue)}
          dayOfWeekFormatter={(_day, weekday) => `${weekday!.format("dd")}`}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: {
              helperText: "",
              focused: false,
              fullWidth: true,
              onFocus: (e) => handleFocus(e),
              onBlur: (e) => handleBlur(e),
            },
          }}
          css={datePickerCss}
        />
      </LocalizationProvider>

      {showAlert && (
        <div css={alertCss}>
          <Tooltip title={validationMessage}>
            <IconButton>
              <ErrorIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
