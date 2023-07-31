import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { IAnswer, IQuestion } from "../../../types";
import { TextField } from "@material-ui/core";
import { css } from "@emotion/react";
import { getTextFieldConfig, validation } from "../../../utils/validation";

export const freeListItemCss = css`
  margin-top: 10px !important;
  margin-bottom: 10px !important;
`;

export const freeListItemLabelCss = css`
  font-size: 0.8rem !important;
  // color: #787878 !important;
  margin-bottom: 0.5em;
`;

export const borderColorCss = (alarm: boolean) => css`
  & .MuiFilledInput-root {
    ${alarm && `border-color:red`}
  }
`;

type IFreeListViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
  needCorrect?: boolean;
  validation: (question: IQuestion) => void;
};

const FreeListView: React.FC<IFreeListViewProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
  needCorrect,
}) => {
  const { docID, config } = question;
  const { simpleType, isLimited, isLimitedValue, limit, limitValue } = config;
  const options = config.options!;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const textFieldConfig = getTextFieldConfig(simpleType);
  const values = userAnswerExist
    ? userAnswer.values
    : options.map((option) => ({
        optionID: option.docID,
        value: "",
        isValid: false,
        isFocused: false,
      }));
  // console.log(textFieldConfig);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    item: typeof options[0]
  ) => {
    const newValue = values.map((value) => {
      if (value.optionID === item.docID) {
        return {
          optionID: value.optionID,
          value: e.target.value,
          isValid: false,
          isFocused: true,
        };
      }
      return value;
    });
    setAnswer({
      questionID: docID,
      values: newValue,
    });
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>,
    item: typeof options[0]
  ) => {
    const newValue = values.map((value) => {
      if (value.optionID === item.docID) {
        return {
          optionID: value.optionID,
          value: value.value,
          isValid: value.isValid,
          isFocused: true,
        };
      }
      return value;
    });
    setAnswer({
      questionID: docID,
      values: newValue,
    });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>,
    item: typeof options[0]
  ) => {
    // const isValid = userAnswer.values.reduce(
    //   (res: boolean, item: { optionID: string | number; value: string }) => {
    //     return res && textFieldConfig.regExp.test(item.value);
    //   },
    //   true
    // );

    console.log("handleBlur");

    const newValue = values.map((value) => {
      if (value.optionID === item.docID) {
        const resultValidation = validation({
          value: value.value,
          simpleType: simpleType ?? "string",
          isLimited,
          isLimitedValue,
          limit,
          limitValue,
        });

        return {
          optionID: value.optionID,
          value: value.value,
          isValid: resultValidation.result,
          isFocused: false,
        };
      }
      return value;
    });

    setAnswer({
      questionID: docID,
      values: newValue,
    });
  };

  return (
    <>
      {options.map((item, i) => {
        const answer = userAnswer?.values.find(
          (answer) => answer.optionID === item.docID
        );
        const alarm =
          Boolean(needCorrect) &&
          !textFieldConfig.regExp.test((answer && answer.value) || "");

        // console.log("alarm", alarm);
        return (
          <FormControl key={item.docID} css={freeListItemCss}>
            <FormLabel component="legend" css={freeListItemLabelCss}>
              {item.title}
            </FormLabel>
            <TextField
              InputProps={{ disableUnderline: true }}
              color="primary"
              variant="filled"
              css={borderColorCss(alarm)}
              value={(answer && answer.value) || ""}
              hiddenLabel
              placeholder={question.hint}
              onChange={(e) => onChange(e, item)}
              onFocus={(e) => handleFocus(e, item)}
              onBlur={(e) => handleBlur(e, item)}
            />
          </FormControl>
        );
      })}
    </>
  );
};

export default FreeListView;
