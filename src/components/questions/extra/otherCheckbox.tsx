import React from "react";
import { FormControlLabel, TextField } from "@material-ui/core";
import GreenCheckbox from "../../common/GreenCheckbox";
import { IAnswer, IValue } from "../../../types";
import { EXTRA_ANSWER } from "../../../consts/const";
import { textFieldCss } from "../views/dropDown/sc";

export type IOtherCheckbox = {
  userAnswer: IAnswer;
  setAnswer: (answer: IAnswer) => void;
  questionID: number;
  singleAnswer: boolean;
  otherPlaceholder: string;
};

const OtherCheckbox: React.FC<IOtherCheckbox> = ({
  userAnswer,
  setAnswer,
  questionID,
  singleAnswer,
  otherPlaceholder,
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
            validationResult: { isValid: false, message: "success" },
            isFocused: false,
          },
        ],
      });
  };

  const autoFocus = value === "";

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
        label={otherPlaceholder ? otherPlaceholder : "Другое"}
        key={"other"}
      />
      {checked && (
        <TextField
          id={"otherTextField" + questionID}
          css={textFieldCss}
          autoFocus={autoFocus}
          InputProps={{ disableUnderline: true }}
          label=""
          placeholder="напишите свой вариант"
          color="primary"
          fullWidth
          multiline
          minRows={3}
          variant="filled"
          value={value}
          onFocus={(e) => {
            const newValues = values.map((v) => {
              if (v.optionID === EXTRA_ANSWER.OTHER) {
                return {
                  optionID: EXTRA_ANSWER.OTHER,
                  value: v.value,
                  validationResult: v.validationResult,
                  isFocused: true,
                };
              }
              return v;
            });
            setAnswer({
              questionID: questionID,
              values: newValues,
            });
          }}
          onBlur={(e) => {
            const newValues = values.map((v) => {
              if (v.optionID === EXTRA_ANSWER.OTHER) {
                return {
                  optionID: EXTRA_ANSWER.OTHER,
                  value: v.value,
                  validationResult: v.validationResult,
                  isFocused: false,
                };
              }
              return v;
            });
            setAnswer({
              questionID: questionID,
              values: newValues,
            });
          }}
          onChange={(e) => {
            const isValid = e.target.value === "" ? false : true;
            setAnswer({
              questionID: questionID,
              values: [
                {
                  optionID: EXTRA_ANSWER.OTHER,
                  value: e.target.value,
                  validationResult: { isValid: isValid, message: "success" },
                  isFocused: true,
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
