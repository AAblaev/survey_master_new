import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Typography } from "@material-ui/core";
import { IQuestion, IAnswer } from "../../../../types";
import GreenCheckbox from "../../../common/GreenCheckbox";
import { formGroupCss } from "./sc";
import { DEFAULT_COLUMNS_COUNT } from "../../../../consts/const";

type ISelectViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
  validation: (question: IQuestion) => void;
};

const SelectView: React.FC<ISelectViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const { dataType, columnsCount: backendColumnsCount } = config;
  const columnsCount = backendColumnsCount
    ? backendColumnsCount
    : DEFAULT_COLUMNS_COUNT;
  const options = config.options!;

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const valuesArr = userAnswerExist ? (userAnswer as IAnswer).values : [];
  const valuesIdArr: (number | string)[] = userAnswerExist
    ? valuesArr.map((item) => item.optionID)
    : [];

  const isSelected = (docID: number) => {
    return valuesIdArr.some((id) => id === docID);
  };

  return (
    <FormGroup css={formGroupCss(columnsCount)}>
      {options.map((item, index) => {
        const isChecked = isSelected(item.docID);
        const handleChange = () => {
          setAnswer({
            questionID: docID,
            values: isChecked
              ? []
              : [
                  {
                    optionID: item.docID,
                    value: item.title,
                    isFocused: false,
                    validationResult: { isValid: true, message: "success" },
                  },
                ],
          });
        };

        const handleChange2 = () => {
          const newValue = isChecked
            ? valuesArr.filter((v) => v.optionID !== item.docID)
            : [
                ...valuesArr,
                {
                  optionID: item.docID,
                  value: item.title,
                  isFocused: false,
                  validationResult: { isValid: true, message: "success" },
                },
              ];
          setAnswer({
            questionID: docID,
            values: newValue,
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
            label={<Typography variant="body2">{item.title}</Typography>}
            key={index}
          />
        );
      })}
    </FormGroup>
  );
};

export default SelectView;
