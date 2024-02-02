import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import GreenCheckbox from "../../common/GreenCheckbox";
import { IAnswer } from "../../../types";
import { EXTRA_ANSWER } from "../../../consts/const";
import GreenRadio from "../../common/GreenRadio";

export type INothingCheckboxProps = {
  userAnswer: IAnswer;
  setAnswer: (answer: IAnswer) => void;
  questionID: number;
  nothingPlaceholder: string;
};

const NothingCheckbox: React.FC<INothingCheckboxProps> = ({
  userAnswer,
  setAnswer,
  questionID,
  nothingPlaceholder,
}) => {
  const checked = Boolean(
    userAnswer &&
      userAnswer.values.length &&
      userAnswer.values[0].optionID === EXTRA_ANSWER.NOTHING
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
            optionID: EXTRA_ANSWER.NOTHING,
            value: "ничего из вышеперечисленного",
            validationResult: { isValid: true, message: "success" },
            isFocused: false,
          },
        ],
      });
  };
  return (
    <FormControlLabel
      control={
        <GreenRadio checked={checked} onChange={handleChange} name={"name"} />
      }
      label={
        nothingPlaceholder ? nothingPlaceholder : "Ничего из вышеперечисленного"
      }
      key={"notAnyOne"}
    />
  );
};

export default NothingCheckbox;
