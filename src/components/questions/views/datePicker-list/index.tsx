import React from "react";

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

import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import { REGEXP_DICT, validation } from "../../../../utils/validation";
import { IViewComponentProps } from "../..";

const ruLocale =
  ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

export const datePickerCss = css`
  & .MuiInputBase-root {
    // width: 10rem;
    border-radius: 0px;
  }
  & .MuiInputBase-input {
    padding: 10px 0px 10px 10px;
  }
  & .MuiOutlinedInput-notchedOutline {
    border: 0;
  }
`;

export const textFieldWrapperCss = (showAlert: boolean) => css`
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid ${showAlert ? "red" : "#e5e5e5"};
  width: 97%;
`;

export const alertCss = css`
  position: absolute;
  top: 0px;
  right: -40px;
  z-index: 1000000000;
`;

export const freeListItemCss = css`
  margin-top: 10px !important;
  margin-bottom: 10px !important;
`;

export const freeListItemLabelCss = css`
  font-size: 0.8rem !important;
  // color: #787878 !important;
  margin-bottom: 0.5em;
`;

export const dateListCss = css`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DatePickerListView: React.FC<IViewComponentProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const { isSimpleDateLimit, simpleDateMax, simpleDateMin, dateType } = config;
  const options = config.options!;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;

  const values = userAnswerExist ? userAnswer.values : [];

  const onChange = (newValue: dayjs.Dayjs | null, item: typeof options[0]) => {
    const isFieldEmpty = !values.some((v) => v.optionID === item.docID);
    const isFocused = values.some(
      (v) => v.optionID === item.docID && v.isFocused
    );

    const value_str = dateParser(newValue ? newValue.toDate() : null) ?? "";

    const validationResult = validation({
      value: value_str,
      simpleType: "datetime",
      isSimpleDateLimit,
      simpleDateMin,
      simpleDateMax,
    });

    if (isFocused) return;

    const newValues = isFieldEmpty
      ? [
          ...values,
          {
            optionID: item.docID,
            value: value_str,
            validationResult: validationResult,
            isFocused: false,
          },
        ]
      : values.map((value) => {
          if (value.optionID === item.docID) {
            return {
              optionID: value.optionID,
              value: value_str,
              validationResult: validationResult,
              isFocused: false,
            };
          }
          return value;
        });

    setAnswer({
      questionID: docID,
      values: newValues,
    });
  };

  const handleFocus = (e: any, item: typeof options[0]) => {
    const isFieldEmpty = !values.some((v) => v.optionID === item.docID);

    const newValue = isFieldEmpty
      ? [
          ...values,
          {
            optionID: item.docID,
            value: "",
            validationResult: { isValid: false, message: "пусто" },
            isFocused: true,
          },
        ]
      : values.map((value) => {
          if (value.optionID === item.docID) {
            return {
              optionID: value.optionID,
              value: value.value,
              validationResult: value.validationResult,
              isFocused: true,
            };
          }
          return value;
        });
    setAnswer({
      questionID: docID,
      values: newValue,
    });
  };

  const handleBlur = (e: any, item: typeof options[0]) => {
    const value = e.target.value;
    if (value === "ДД.ММ.ГГГГ") {
      const prevValue = values.filter((v) => v.optionID !== item.docID);
      setAnswer({
        questionID: docID,
        values: prevValue,
      });
      return;
    }

    const validationResult = validation({
      value,
      simpleType: "datetime",
      isSimpleDateLimit,
      simpleDateMin,
      simpleDateMax,
    });

    const needChangeValue =
      validationResult.message !== "допустимый формат дд.мм.гггг";

    const newValue = values.map((v) => {
      if (v.optionID === item.docID) {
        return {
          optionID: v.optionID,
          value: needChangeValue ? value : "",
          validationResult: validationResult,
          isFocused: false,
        };
      }
      return v;
    });
    setAnswer({ questionID: docID, values: newValue });
  };

  const [minDate, maxDate] = getDateRange({
    isSimpleDateLimit,
    dateType: dateType as number,
    simpleDateMax,
    simpleDateMin,
  });

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ru"
      localeText={ruLocale}
    >
      <div css={dateListCss}>
        {options.map((item, i) => {
          const answer = userAnswer?.values.find(
            (answer) => answer.optionID === item.docID
          );
          const answerExist = Boolean(answer && userAnswerExist);
          const value = answer ? answer.value : null;
          const showAlert =
            answerExist &&
            !answer!.validationResult.isValid &&
            !answer!.isFocused;
          const validationMessage = answerExist
            ? answer!.validationResult.message
            : "";
          const parsedValue = dateParserForDayjs(value);
          return (
            <FormControl key={item.docID} css={freeListItemCss}>
              <FormLabel component="legend" css={freeListItemLabelCss}>
                {item.title}
              </FormLabel>
              <div css={textFieldWrapperCss(showAlert)}>
                <MuiDatePicker
                  views={["year", "month", "day"]}
                  value={parsedValue}
                  onChange={(value) => onChange(value, item)}
                  slotProps={{
                    textField: {
                      helperText: "",
                      focused: false,
                      fullWidth: true,
                      onFocus: (e) => handleFocus(e, item),
                      onBlur: (e) => handleBlur(e, item),
                    },
                  }}
                  dayOfWeekFormatter={(_day, weekday) =>
                    `${weekday!.format("dd")}`
                  }
                  css={datePickerCss}
                  minDate={minDate}
                  maxDate={maxDate}
                />
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
            </FormControl>
          );
        })}
      </div>
    </LocalizationProvider>
  );
};

export default DatePickerListView;
