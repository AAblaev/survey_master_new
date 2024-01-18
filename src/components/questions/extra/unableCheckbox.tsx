import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import GreenCheckbox from "../../common/GreenCheckbox";
import { IAnswer } from "../../../types";
import { EXTRA_ANSWER } from "../../../consts/const";

export type IUnableCheckbox = {
  userAnswer: IAnswer;
  setAnswer: (answer: IAnswer) => void;
  questionID: number;
  difficultToAnswerPlaceholder: string;
};

const UnableCheckbox: React.FC<IUnableCheckbox> = ({
  userAnswer,
  setAnswer,
  questionID,
  difficultToAnswerPlaceholder,
}) => {
  const checked = Boolean(
    userAnswer &&
      userAnswer.values.length &&
      userAnswer.values[0].optionID === EXTRA_ANSWER.UNABLE
  );
  const handleChange = () => {
    checked &&
      setAnswer({
        questionID: questionID,
        values: [],
      });
    !checked &&
      setAnswer({
        questionID: questionID,
        values: [
          {
            optionID: EXTRA_ANSWER.UNABLE,
            value: difficultToAnswerPlaceholder,
            validationResult: { isValid: true, message: "success" },
            isFocused: false,
          },
        ],
      });
  };
  return (
    <FormControlLabel
      control={
        <GreenCheckbox
          checked={checked}
          onChange={handleChange}
          name={"name"}
        />
      }
      label={
        difficultToAnswerPlaceholder
          ? difficultToAnswerPlaceholder
          : "Затрудняюсь ответить"
      }
      key={"unable"}
    />
  );
};

export default UnableCheckbox;
