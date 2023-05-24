import React from "react";
import { css } from "@emotion/react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core";
import { IQuestion, IAnswer } from "../../../types";
import GreenCheckbox from "../../common/GreenCheckbox";

export const freeListItemCss = css`
  margin-top: 10px !important;
  margin-bottom: 10px !important;
`;

export const freeListItemLabelCss = css`
  font-size: 1.2em !important;
  color: #787878 !important;
`;

export const formGroupCss = css`
  &.MuiFormGroup-root {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

type ISelectViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
};

const SelectView: React.FC<ISelectViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const { dataType } = config;
  const options = config.options!;

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const valuesArr = userAnswerExist ? (userAnswer as IAnswer).values : [];
  const valuesIdArr: number[] = userAnswerExist
    ? valuesArr.map((item) => item.optionID)
    : [];

  const isSelected = (docID: number) => {
    return valuesIdArr.some((id) => id === docID);
  };

  return (
    <FormGroup css={formGroupCss}>
      {options.map((item, index) => {
        const isChecked = isSelected(item.docID);
        const handleChange = () => {
          setAnswer({
            questionID: docID,
            values: isChecked
              ? []
              : [{ optionID: item.docID, value: item.title }],
          });
        };

        const handleChange2 = () => {
          setAnswer({
            questionID: docID,
            values: isChecked
              ? valuesArr.filter((v) => v.optionID !== item.docID)
              : [...valuesArr, { optionID: item.docID, value: item.title }],
          });
        };

        return (
          <FormControlLabel
            control={
              <GreenCheckbox
                checked={isChecked}
                onChange={dataType === "select" ? handleChange : handleChange2}
                name={item.title}
              />
            }
            label={item.title}
            key={index}
          />
        );
      })}
    </FormGroup>
  );
};

export default SelectView;
