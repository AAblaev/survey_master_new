import React from "react";
import { FormControlLabel } from "@material-ui/core";
import GreenCheckbox from "../../common/GreenCheckbox";
import { IAnswer } from "../../../types";
import { EXTRA_ANSWER } from "../../../consts/const";
import { css } from "@emotion/react";

export type IUnableCheckbox = {
  userAnswer: IAnswer;
  setAnswer: (answer: IAnswer) => void;
  questionID: number;
};

const UnableCheckbox: React.FC<IUnableCheckbox> = ({
  userAnswer,
  setAnswer,
  questionID,
}) => {
  const checked = Boolean(
    userAnswer &&
      userAnswer.values.length &&
      userAnswer.values[0].optionID === EXTRA_ANSWER.UNABLE
  );
  const handleChange = () => {
    checked && setAnswer({ questionID: questionID, values: [] });
    !checked &&
      setAnswer({
        questionID: questionID,
        values: [
          { optionID: EXTRA_ANSWER.UNABLE, value: "Затрудняюсь ответить" },
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
      label="Затрудняюсь ответить"
      key={"unable"}
    />
  );
};

export default UnableCheckbox;
