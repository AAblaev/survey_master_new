import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { IQuestion, IAnswer } from "../../../../types";
import GreenCheckbox from "../../../common/GreenCheckbox";
import { formGroupCss } from "./sc";
import { DEFAULT_COLUMNS_COUNT } from "../../../../consts/const";
import GreenRadio from "../../../common/GreenRadio";
import { IViewComponentProps } from "../..";

const MultiSelectView: React.FC<IViewComponentProps> = ({
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
                onChange={handleChange}
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

export default MultiSelectView;
