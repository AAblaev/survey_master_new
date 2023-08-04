import React from "react";
import { FormControlLabel, TextField } from "@material-ui/core";
import GreenCheckbox from "../../common/GreenCheckbox";
import { IAnswer } from "../../../types";
import { EXTRA_ANSWER } from "../../../consts/const";

export type IOtherCheckbox = {
  userAnswer: IAnswer;
  setAnswer: (answer: IAnswer) => void;
  questionID: number;
};

const OtherCheckbox: React.FC<IOtherCheckbox> = ({
  userAnswer,
  setAnswer,
  questionID,
}) => {
  const checked = Boolean(
    userAnswer &&
      userAnswer.values.length &&
      userAnswer.values[0].optionID === EXTRA_ANSWER.OTHER
  );
  const value = checked ? userAnswer.values[0].value : "";

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
            optionID: EXTRA_ANSWER.OTHER,
            value: "",
            validationResult: { isValid: true, message: "success" },
            isFocused: false,
          },
        ],
      });
  };
  return (
    <>
      <FormControlLabel
        control={
          <GreenCheckbox
            checked={checked}
            onChange={handleChange}
            name={"name"}
          />
        }
        label="Другое"
        key={"other"}
      />
      {checked && (
        <TextField
          id={"otherTextField" + questionID}
          InputProps={{ disableUnderline: true }}
          label=""
          color="primary"
          fullWidth
          multiline
          minRows={3}
          variant="filled"
          value={value}
          onChange={(e) => {
            setAnswer({
              questionID: questionID,
              values: [
                {
                  optionID: EXTRA_ANSWER.OTHER,
                  value: e.target.value,
                  validationResult: { isValid: true, message: "success" },
                  isFocused: false,
                },
              ],
            });
          }}
        />
      )}
    </>
  );
};

export default OtherCheckbox;
