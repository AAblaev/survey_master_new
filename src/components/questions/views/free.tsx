import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { IAnswer, IQuestion, ISimpleType, IState } from "../../../types";

type IFreeQuestionProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
};

const getTextFieldConfig = (simpleType?: ISimpleType) => {
  const defaultTextFieldConfig = {
    fullWidth: true,
    minRows: 2,
    regExp: "",
    mask: "",
  };

  switch (simpleType) {
    case "string": {
      return defaultTextFieldConfig;
    }
    case "int": {
      return defaultTextFieldConfig;
    }
    case "float": {
      return defaultTextFieldConfig;
    }
    case "datetime": {
      return defaultTextFieldConfig;
    }

    default: {
      return defaultTextFieldConfig;
    }
  }
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
      onFocus={() => console.log("onFocus")}
      onBlur={() => console.log("onBlur")}
      onChange={(e) => {
        setAnswer({
          questionID: docID,
          values: [{ value: e.target.value, optionID: String(0) }],
          // need validation
          isValid: true,
          isFocused: true,
        });
      }}
    />
  );
};

export default FreeView;
