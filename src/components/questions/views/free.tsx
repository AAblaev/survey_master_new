import React from "react";
import TextField from "@material-ui/core/TextField";
import { IAnswer, IQuestion } from "../../../types";
import { REGEXP_DICT, validation } from "../../../utils/validation";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import Tooltip from "@material-ui/core/Tooltip";
import { borderColorCss } from "./free-list";

type IFreeQuestionProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
  validation: (question: IQuestion, optionID?: string) => void;
};

const FreeView: React.FC<IFreeQuestionProps> = ({
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
  const showAlert =
    userAnswerExist &&
    !userAnswer.values[0].validationResult.isValid &&
    !userAnswer.values[0].isFocused;
  // console.log("userAnswerExist", userAnswerExist);
  // console.log(
  //   "!userAnswer.values[0].validationResult.isValid",
  //   userAnswerExist && !userAnswer.values[0].validationResult.isValid
  // );
  // console.log(
  //   "!userAnswer.values[0].isFocused",
  //   userAnswerExist && !userAnswer.values[0].isFocused
  // );
  // console.log("showAlert", showAlert);

  const validationMessage = userAnswerExist
    ? userAnswer.values[0].validationResult.message
    : "";
  const value = userAnswerExist
    ? (userAnswer.values as IAnswer["values"])[0].value
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (
      (simpleType === "integer" || simpleType === "float") &&
      !REGEXP_DICT["float"].test(value)
    ) {
      return;
    }
    setAnswer({
      questionID: docID,
      values: [
        {
          value,
          optionID: 0,
          isFocused: true,
          validationResult: { isValid: false, message: "ошибка" },
        },
      ],
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setAnswer({
      questionID: docID,
      values: [
        {
          value: value,
          optionID: 0,
          isFocused: true,
          validationResult: { isValid: false, message: "ошибка" },
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
      value,
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
          value: value,
          optionID: 0,
          isFocused: false,
          validationResult,
        },
      ],
    });
  };

  return (
    <TextField
      id="outlined-multiline-static"
      InputProps={{
        disableUnderline: true,
        endAdornment: showAlert && (
          <InputAdornment position="end">
            <Tooltip title={validationMessage}>
              <IconButton>
                <ErrorIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
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
      value={value}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

export default FreeView;
