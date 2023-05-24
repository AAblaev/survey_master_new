import React from "react";
import { FormControlLabel } from "@material-ui/core";
import GreenCheckbox from "../../common/GreenCheckbox";
import { IAnswer } from "../../../types";
import { EXTRA_ANSWER } from "../../../consts/const";

export type INothingCheckboxProps = {
  userAnswer: IAnswer;
  setAnswer: (answer: IAnswer) => void;
  questionID: number;
};

const NothingCheckbox: React.FC<INothingCheckboxProps> = ({
  userAnswer,
  setAnswer,
  questionID,
}) => {
  const checked = Boolean(
    userAnswer &&
      userAnswer.values.length &&
      userAnswer.values[0].optionID === EXTRA_ANSWER.NOTHING
  );
  const handleChange = () => {
    checked && setAnswer({ questionID: questionID, values: [] });
    !checked &&
      setAnswer({
        questionID: questionID,
        values: [
          {
            optionID: EXTRA_ANSWER.NOTHING,
            value: "ничего из вышеперечисленного",
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
      label="Ничего из вышеперечисленного"
      key={"notAnyOne"}
    />
  );
};

export default NothingCheckbox;
