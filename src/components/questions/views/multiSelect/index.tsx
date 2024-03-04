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
import OtherCheckbox from "../../extra/otherCheckbox";
import NothingCheckbox from "../../extra/nothingCheckbox";

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
  const { dataType, columnsCount: backendColumnsCount } = config;
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

  const optionsDict = options.reduce(
    (res, option) => ({ ...res, [`${option.docID}`]: option }),
    {
      "-1": {
        docID: -1,
        height: 0,
        order: 0,
        photoID: 0,
        title: "затрудняюсь ответить",
        width: 0,
      },
      "-2": {
        docID: -2,
        height: 0,
        order: 0,
        photoID: 0,
        title: nothingPlaceholder,
        width: 0,
      },
      "-3": {
        docID: -3,
        height: 0,
        order: 0,
        photoID: 0,
        title: "",
        width: 0,
      },
    }
  ) as { [key: string]: IOption };

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const valuesArr = userAnswerExist ? (userAnswer as IAnswer).values : [];
  const valuesIdArr: (number | string)[] = userAnswerExist
    ? valuesArr.map((item) => item.optionID)
    : [];

  const isSelected = (docID: number) => {
    return valuesIdArr.some((id) => id === docID);
  };

  const handleChange = (item: IOption, isChecked: boolean) => {
    // console.log(item);
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
  // const handleChange = () => {
  //   const newValue = isChecked
  //     ? valuesArr.filter((v) => v.optionID !== item.docID)
  //     : [
  //         ...valuesArr,
  //         {
  //           optionID: item.docID,
  //           value: item.title,
  //           isFocused: false,
  //           validationResult: { isValid: true, message: "success" },
  //         },
  //       ];
  //   setAnswer({
  //     questionID: docID,
  //     values: newValue,
  //   });
  // };
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
