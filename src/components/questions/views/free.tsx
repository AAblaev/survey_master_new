import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { IAnswer, IQuestion, ISimpleType, IState } from "../../../types";
import { getTextFieldConfig } from "../../../utils/validation";

type IFreeQuestionProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
};

const FreeView: React.FC<IFreeQuestionProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const { isMultiline, simpleType } = config;
  const textFieldConfig = getTextFieldConfig(simpleType);
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const value = userAnswerExist
    ? (userAnswer.values as IAnswer["values"])[0].value
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer({
      questionID: docID,
      values: [{ value: e.target.value, optionID: String(0) }],
      isValid: false,
      isFocused: true,
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setAnswer({
      questionID: docID,
      values: [{ value: value, optionID: String(0) }],
      isValid: false,
      isFocused: true,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const isValid = textFieldConfig.regExp.test(value);
    // console.log("isValid", isValid);
    setAnswer({
      questionID: docID,
      values: [{ value: value, optionID: String(0) }],
      // need validation
      isValid: isValid,
      isFocused: false,
    });
  };

  return (
    <TextField
      id="outlined-multiline-static"
      InputProps={{ disableUnderline: true }}
      // label="Ответ"
      hiddenLabel
      color="primary"
      fullWidth
      multiline={isMultiline}
      minRows={2}
      variant="filled"
      value={value}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

export default FreeView;
