import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { IAnswer, IQuestion, ISimpleType, IState } from "../../../types";
import { getTextFieldConfig, validation } from "../../../utils/validation";

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
  const value = userAnswerExist
    ? (userAnswer.values as IAnswer["values"])[0].value
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer({
      questionID: docID,
      values: [
        {
          value: e.target.value,
          optionID: String(0),
          isFocused: true,
          isValid: false,
        },
      ],
      // isValid: false,
      // isFocused: true,
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setAnswer({
      questionID: docID,
      values: [
        { value: value, optionID: String(0), isFocused: true, isValid: false },
      ],
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    console.log("handleBlur");

    const resultValidation = validation({
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
          optionID: String(0),
          isFocused: false,
          isValid: resultValidation.result,
        },
      ],
    });
    console.log("validation", resultValidation);
  };

  return (
    <TextField
      id="outlined-multiline-static"
      InputProps={{ disableUnderline: true }}
      hiddenLabel
      placeholder={question.hint}
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
