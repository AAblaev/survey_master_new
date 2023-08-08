import React from "react";
import { FormControlLabel, TextField } from "@material-ui/core";
import GreenCheckbox from "../../common/GreenCheckbox";
import { IAnswer, IValue } from "../../../types";
import { EXTRA_ANSWER } from "../../../consts/const";

export type IOtherCheckbox = {
  userAnswer: IAnswer;
  setAnswer: (answer: IAnswer) => void;
  questionID: number;
  singleAnswer: boolean;
};

const OtherCheckbox: React.FC<IOtherCheckbox> = ({
  userAnswer,
  setAnswer,
  questionID,
  singleAnswer,
}) => {
  const hasOtherInUserAnswer =
    userAnswer &&
    userAnswer.values.length > 0 &&
    userAnswer.values.find((v) => v.optionID === EXTRA_ANSWER.OTHER);
  const checked = Boolean(hasOtherInUserAnswer);

  const value = checked ? (hasOtherInUserAnswer as IValue).value : "";

  const values = userAnswer ? userAnswer.values : [];

  const handleChange = () => {
    const newValues = singleAnswer ? [] : values;

    checked &&
      setAnswer({
        questionID: questionID,
        values: newValues.filter((v) => v.optionID !== EXTRA_ANSWER.OTHER),
      });

    !checked &&
      setAnswer({
        questionID: questionID,
        values: [
          ...newValues.filter(
            (v) =>
              v.optionID !== EXTRA_ANSWER.NOTHING &&
              v.optionID !== EXTRA_ANSWER.UNABLE
          ),
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
