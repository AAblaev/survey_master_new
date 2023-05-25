import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { IAnswer, IQuestion, IState } from "../../../types";
import { css } from "@emotion/react";

export const freeQuestionCss = css`
  & .MuiFormLabel-root {
    color: #000000;
    font-size: 1.3rem;
    font-weight: 300;
  }

  & .MuiInputLabel-root {
    color: #46acaf;
    &.Mui-focused {
      color: #46acaf;
    }
  }

  & .MuiFilledInput-root {
    font-size: 1.3rem;
    border: 1px solid #46acaf;
    background-color: #fcfcfb;
    border-radius: 4px;
  }
  & .MuiFilledInput-root.Mui-focused {
    background-color: #fcfcfb;
    box-shadow: #46acaf;
    border-color: #46acaf;
  }
  & .MuiFilledInput-root:hover {
    background-color: transparent;
  }
`;

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
  const isMultiline = config.isMultiline;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const value = userAnswerExist
    ? (userAnswer.values as IAnswer["values"])[0].value
    : "";

  return (
    <TextField
      id="outlined-multiline-static"
      InputProps={{ disableUnderline: true }}
      label="Ответ"
      color="primary"
      fullWidth
      multiline={isMultiline}
      minRows={2}
      variant="filled"
      value={value}
      onChange={(e) => {
        setAnswer({
          questionID: docID,
          values: [{ value: e.target.value, optionID: 0 }],
        });
      }}
    />
  );
};

export default FreeView;
