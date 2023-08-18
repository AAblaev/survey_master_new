import React from "react";
import FormControl from "@material-ui/core/FormControl";
import { IAnswer, IOption, IQuestion } from "../../../../types";
import { MenuItem, Select, TextField } from "@material-ui/core";
import { css } from "@emotion/react";
import { DEFAULT_HINT_VALUE, EXTRA_ANSWER } from "../../../../consts/const";
import { formControlCss, renderValueCss } from "./sc";

type IDropDownViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
  validation: (question: IQuestion) => void;
};

const DropDownView: React.FC<IDropDownViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const {
    docID,
    config,
    hint,
    hasNothingAnswer,
    hasOtherAnswer,
    hasUnableAnswer,
  } = question;

  const options = config.options!;
  const selectItems = [...options];
  hasOtherAnswer &&
    selectItems.push({
      docID: -3,
      height: 0,
      order: 0,
      photoID: 0,
      title: "другое",
      width: 0,
    });

  hasNothingAnswer &&
    selectItems.push({
      docID: -2,
      height: 0,
      order: 0,
      photoID: 0,
      title: "ничего из вышеперечисленного",
      width: 0,
    });

  // hasUnableAnswer &&
  //   selectItems.push({
  //     docID: -1,
  //     height: 0,
  //     order: 0,
  //     photoID: 0,
  //     title: "затрудняюсь ответить",
  //     width: 0,
  //   });

  const optionsDict = options.reduce(
    (res, option) => ({ ...res, [`${option.docID}`]: option }),
    {
      default: {
        docID: -99,
        height: 0,
        order: 0,
        photoID: 0,
        title: hint ? hint : DEFAULT_HINT_VALUE,
        width: 0,
      },
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
        title: "ничего из вышеперечисленного",
        width: 0,
      },
      "-3": {
        docID: -3,
        height: 0,
        order: 0,
        photoID: 0,
        title: "другое",
        width: 0,
      },
    }
  ) as { [key: string]: IOption };

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const value = userAnswerExist
    ? optionsDict[(userAnswer.values as IAnswer["values"])[0].optionID].docID
    : "";

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const optionID = e.target.value as number;
    setAnswer({
      questionID: docID,
      values: [
        {
          optionID: optionID,
          value:
            optionID === EXTRA_ANSWER.OTHER
              ? ""
              : String(optionsDict[optionID].title),
          validationResult: { isValid: true, message: "success" },
          isFocused: false,
        },
      ],
    });
  };

  return (
    <>
      <FormControl variant="standard" css={formControlCss}>
        <Select
          value={value}
          onChange={handleChange}
          defaultValue=""
          disableUnderline
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            getContentAnchorEl: null,
          }}
          displayEmpty={true}
          renderValue={(value: any) => {
            return (
              <span css={renderValueCss(value === "")}>
                {value === "" || value === EXTRA_ANSWER.UNABLE
                  ? optionsDict["default"].title
                  : optionsDict[value].title}
              </span>
            );
          }}
        >
          {selectItems.map((item) => (
            <MenuItem key={item.docID} value={item.docID}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {value === EXTRA_ANSWER.OTHER && (
        <TextField
          id={"otherTextField" + docID}
          InputProps={{ disableUnderline: true }}
          placeholder="напишите свой вариант"
          label=""
          color="primary"
          fullWidth
          multiline
          minRows={3}
          variant="filled"
          value={userAnswer.values[0].value}
          onChange={(e) => {
            setAnswer({
              questionID: docID,
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

export default DropDownView;
