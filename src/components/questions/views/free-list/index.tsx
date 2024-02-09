import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import { css } from "@emotion/react";
import { REGEXP_DICT, validation } from "../../../../utils/validation";
import { IViewComponentProps } from "../..";
import { IOption, IValue } from "../../../../types";
import TextFieldRow from "./TextFieldRow";

export const textFieldWrapperCss = css`
  display: flex;
  align-items: center;
  position: relative;
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

export const borderColorCss = (alarm: boolean) => css`
  & .MuiInputBase-root {
    border-radius: 0px;
    background-color: transparent;
  }
  & .MuiInputBase-input {
    padding: 11px;
    border: 0px solid red;
    background-color: transparent;
  }
  & .Mui-focused {
    background-color: transparent;
  }
  background-color: transparent;
  & .MuiInputBase-input:focus {
    background-color: transparent;
  }

  & .MuiFilledInput-root {
    ${alarm && `border-color:red`}
  }

  & .MuiFilledInput-multiline {
    border: 0px solid red;
  }
  & .MuiFilledInput-root.Mui-focused {
    // background-color: #fff;
    background-color: transparent;

    box-shadow: #46acaf;
    border-color: #e5e5e5;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: 0px solid red;
    border-size: 0px;
  }

  &
    .MuiInputBase-root-MuiOutlinedInput-root.Mui-focused.MuiOutlinedInput-notchedOutline {
    border-size: 0px;
  }

  & > fieldset {
    border-size: 0px;
  }
`;

const getValuesDict = (values: IValue[], options: IOption[]) => {
  const dictTemplate = options.reduce(
    (res, option) => ({
      ...res,
      [String(option.docID)]: {
        optionID: option.docID,
        value: "",
        validationResult: { isValid: true, message: "" },
        isFocused: false,
      },
    }),
    {}
  );
  return values.reduce((res, v) => {
    return { ...res, [String(v.optionID)]: v };
  }, dictTemplate);
};

const FreeListView: React.FC<IViewComponentProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const {
    simpleType,
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
    isMultiline,
  } = config;
  const options = config.options!;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;

  const values = userAnswerExist ? userAnswer.values : [];

  const storeTextValues: { [key: string]: IValue } = getValuesDict(
    values,
    options
  );

  console.log("storeTextValues", storeTextValues);

  const handleFocus = (rowDocID: number) => {
    const newValue = { ...storeTextValues[String(rowDocID)], isFocused: true };
    const newValues = Object.values({ ...storeTextValues, newValue }).filter(
      (v) => v.value !== ""
    );
    setAnswer({
      questionID: docID,
      values: newValues,
    });
  };

  const handleBlur = (rowDocID: number, value: string) => {
    // if (value.trim() === "") {
    //   setAnswer({
    //     questionID: docID,
    //     values: [],
    //   });
    //   return;
    // }
    const validationResult = validation({
      value: value,
      simpleType: simpleType ?? "string",
      isLimited,
      isLimitedValue,
      limit,
      limitValue,
    });
    const newValue = {
      ...storeTextValues[String(rowDocID)],
      value: value,
      isFocused: false,
      validationResult: validationResult,
    };
    const newValues = Object.values({ ...storeTextValues, newValue });

    setAnswer({
      questionID: docID,
      values: newValues.filter((v) => v.value !== ""),
    });
  };

  return (
    <>
      {options.map((item, i) => {
        const value = storeTextValues[String(item.docID)] as IValue;
        console.log(i, "---", value);

        return (
          <TextFieldRow
            key={item.docID}
            value={value}
            title={item.title}
            simpleType={simpleType}
            isMultiline={isMultiline}
            hint={question.hint ? question.hint : ""}
            handleFocus={(rowDocID: number) => {
              handleFocus(rowDocID);
            }}
            handleBlur={(rowDocID: number, value: string) => {
              handleBlur(rowDocID, value);
            }}
            rowDocID={item.docID}
          />
        );
      })}
    </>
  );
};

export default FreeListView;

// const onChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   item: typeof options[0]
// ) => {
//   if (
//     (simpleType === "integer" || simpleType === "float") &&
//     !REGEXP_DICT["float"].test(e.target.value)
//   ) {
//     return;
//   }
//
//   setValueDict({
//     ...valueDict,
//     [String(item.docID)]: {
//       optionID: item.docID,
//       value: e.target.value,
//       validationResult: { isValid: false, message: "ошибка" },
//       isFocused: true,
//     },
//   });

// const newValue = values.map((value) => {
//   if (value.optionID === item.docID) {
//     return {
//       optionID: value.optionID,
//       value: e.target.value,
//       validationResult: { isValid: false, message: "ошибка" },
//       isFocused: true,
//     };
//   }
//   return value;
// });
// setAnswer({
//   questionID: docID,
//   values: newValue,
// });
// };
