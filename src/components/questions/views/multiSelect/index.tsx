import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import OtherCheckbox from "../../parts/extra/otherCheckbox";
import NothingCheckbox from "../../parts/extra/nothingCheckbox";
import GreenCheckbox from "../../../common/GreenCheckbox";
import { IAnswer, IOption } from "../../../../types";
import { IViewComponentProps } from "../..";
import { formGroupCss } from "./sc";
import { DEFAULT_COLUMNS_COUNT, EXTRA_ANSWER } from "../../../../consts/const";

const MultiSelectView: React.FC<IViewComponentProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const {
    docID,
    config,
    hasNothingAnswer,
    hasOtherAnswer,
    nothingPlaceholder,
    otherPlaceholder,
  } = question;
  const { columnsCount: backendColumnsCount } = config;
  const columnsCount = backendColumnsCount
    ? backendColumnsCount
    : DEFAULT_COLUMNS_COUNT;
  const options = config.options!;
  const selectItems = [...options];

  hasOtherAnswer &&
    selectItems.push({
      docID: -3,
      height: 0,
      order: 0,
      photoID: 0,
      title: otherPlaceholder,
      width: 0,
    });

  hasNothingAnswer &&
    selectItems.push({
      docID: -2,
      height: 0,
      order: 0,
      photoID: 0,
      title: nothingPlaceholder,
      width: 0,
    });

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const valuesArr = userAnswerExist ? (userAnswer as IAnswer).values : [];
  const valuesIdArr: (number | string)[] = userAnswerExist
    ? valuesArr.map((item) => item.optionID)
    : [];

  const isSelected = (docID: number) => {
    return valuesIdArr.some((id) => id === docID);
  };

  const handleChange = (item: IOption, isChecked: boolean) => {
    const newValue = isChecked
      ? valuesArr.filter((v) => v.optionID !== item.docID)
      : [
          ...valuesArr.filter((v) => v.optionID !== EXTRA_ANSWER.UNABLE),
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
    <>
      <FormGroup css={formGroupCss(columnsCount)}>
        {options.map((item, index) => {
          const isChecked = isSelected(item.docID);
          return (
            <FormControlLabel
              control={
                <GreenCheckbox
                  checked={isChecked}
                  onChange={() => handleChange(item, isChecked)}
                  name={item.title}
                />
              }
              label={<Typography variant="body2">{item.title}</Typography>}
              key={index}
            />
          );
        })}
      </FormGroup>
      {hasOtherAnswer && (
        <OtherCheckbox
          userAnswer={userAnswer as IAnswer}
          setAnswer={setAnswer}
          questionID={question.docID}
          singleAnswer={false}
          otherPlaceholder={otherPlaceholder}
        />
      )}
      {hasNothingAnswer && (
        <NothingCheckbox
          userAnswer={userAnswer as IAnswer}
          setAnswer={setAnswer}
          questionID={question.docID}
          nothingPlaceholder={nothingPlaceholder}
          singleAnswer={false}
        />
      )}
    </>
  );
};

export default MultiSelectView;
