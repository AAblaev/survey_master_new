import React, { useEffect } from "react";
import { css } from "@emotion/react";
import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  withStyles,
} from "@material-ui/core";
import GreenCheckbox from "../../common/GreenCheckbox";
import { IAnswer } from "../../../types";

export type INotAnyOnePrors = {
  userAnswer: IAnswer;
  setAnswer: (answer: IAnswer) => void;
  questionID: number;
};

const NotAnyOne: React.FC<INotAnyOnePrors> = ({
  userAnswer,
  setAnswer,
  questionID,
}) => {
  const checked = Boolean(
    userAnswer &&
      userAnswer.values.length &&
      userAnswer.values[0].optionID === -2
  );
  const handleChange = () => {
    checked && setAnswer({ questionID: questionID, values: [] });
    !checked &&
      setAnswer({
        questionID: questionID,
        values: [{ optionID: -2, value: "ничего из вышеперечисленного" }],
      });
  };
  return (
    <FormControlLabel
      control={
        <GreenCheckbox
          checked={checked}
          onChange={() => {
            handleChange();
          }}
          name={"name"}
        />
      }
      label="Ничего из вышеперечисленного"
      key={"notAnyOne"}
    />
  );
};

export default NotAnyOne;
