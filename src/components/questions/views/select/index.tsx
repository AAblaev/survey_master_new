import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { IQuestion, IAnswer, IOption } from "../../../../types";
import GreenCheckbox from "../../../common/GreenCheckbox";
import { formGroupCss } from "./sc";
import { DEFAULT_COLUMNS_COUNT } from "../../../../consts/const";
import GreenRadio from "../../../common/GreenRadio";
import { IViewComponentProps } from "../..";

const SelectView: React.FC<IViewComponentProps> = ({
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

  const handleChange = (isChecked: boolean, option: IOption) => {
    setAnswer({
      questionID: docID,
      values: isChecked
        ? []
        : [
            {
              optionID: option.docID,
              value: option.title,
              isFocused: false,
              validationResult: { isValid: true, message: "success" },
            },
          ],
    });
  };

  return (
    <FormGroup css={formGroupCss(columnsCount)}>
      {options.map((item, index) => {
        const isChecked = isSelected(item.docID);
        return (
          <FormControlLabel
            control={
              <GreenRadio
                checked={isChecked}
                onClick={() => handleChange(isChecked, item)}
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
