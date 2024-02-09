import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { IAnswer, IQuestion } from "../../../../types";
import { REGEXP_DICT, validation } from "../../../../utils/validation";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import { alertCss, borderColorCss, textFieldWrapperCss } from "../free-list";
import MyDatePicker from "../../../common/datePicker";
import { IViewComponentProps } from "../..";

const FreeView: React.FC<IViewComponentProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const {
    isMultiline,
    simpleType,
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
  } = config;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const storeTextValue = userAnswerExist
    ? (userAnswer.values as IAnswer["values"])[0].value
    : "";

  const [textValue, setTextValue] = useState(storeTextValue);

  const showAlert =
    userAnswerExist &&
    !userAnswer.values[0].validationResult.isValid &&
    !userAnswer.values[0].isFocused;

  const validationMessage = userAnswerExist
    ? userAnswer.values[0].validationResult.message
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (
      (simpleType === "integer" || simpleType === "float") &&
      !REGEXP_DICT["float"].test(value)
    ) {
      return;
    }
    setTextValue(value);
    // const isValid =
    //   userAnswerExist && userAnswer.values[0].validationResult.isValid;
    //
    // setAnswer({
    //   questionID: docID,
    //   values: [
    //     {
    //       value,
    //       optionID: 0,
    //       isFocused: true,
    //       validationResult: { isValid: isValid, message: "ошибка" },
    //     },
    //   ],
    // });
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const isValid =
      userAnswerExist && userAnswer.values[0].validationResult.isValid;
    setAnswer({
      questionID: docID,
      values: [
        {
          value: textValue,
          optionID: 0,
          isFocused: true,
          validationResult: { isValid: isValid, message: "ошибка" },
        },
      ],
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.target.value.trim() === "") {
      setAnswer({
        questionID: docID,
        values: [],
      });
      return;
    }

    const validationResult = validation({
      value: textValue,
      simpleType: simpleType ?? "string",
      isLimited,
      isLimitedValue,
      limit,
      limitValue,
    });

    setAnswer({
      questionID: docID,
      values: [
        {
          value: textValue,
          optionID: 0,
          isFocused: false,
          validationResult,
        },
      ],
    });
  };

  useEffect(() => {
    setTextValue(storeTextValue);
  }, [storeTextValue]);

  return (
    <div css={textFieldWrapperCss}>
      <TextField
        id="outlined-multiline-static"
        InputProps={{
          disableUnderline: true,
          type:
            simpleType === "integer" || simpleType === "float"
              ? "number"
              : "text",
        }}
        hiddenLabel
        placeholder={question.hint}
        color="primary"
        variant="filled"
        css={borderColorCss(showAlert)}
        fullWidth
        multiline={isMultiline}
        minRows={4}
        maxRows={4}
        value={textValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <div style={{ minWidth: "40px" }}>
        {showAlert && (
          <Tooltip title={validationMessage}>
            <IconButton>
              <ErrorIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default FreeView;
//
// endAdornment: showAlert && (
//   <InputAdornment position="end">
//     <Tooltip title={validationMessage}>
//       <IconButton>
//         <ErrorIcon />
//       </IconButton>
//     </Tooltip>
//   </InputAdornment>
// ),
