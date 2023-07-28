import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { IAnswer, IQuestion } from "../../../types";
import { TextField } from "@material-ui/core";
import { css } from "@emotion/react";
import { getTextFieldConfig } from "../../../utils/validation";

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
};

const FreeListView: React.FC<IFreeListViewProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
  needCorrect,
}) => {
  const { docID, config } = question;
  const options = config.options!;
  const simpleType = config.simpleType;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const textFieldConfig = getTextFieldConfig(simpleType);
  // console.log(textFieldConfig);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    item: typeof options[0]
  ) => {
    const values = options.map((option) => ({
      optionID: option.docID,
      value:
        option.docID === item.docID
          ? e.target.value
          : (userAnswerExist &&
              userAnswer.values.find((el) => el.optionID === option.docID)
                ?.value) ||
            "",
    }));
    setAnswer({
      questionID: docID,
      values: values,
      isValid: false,
      isFocused: true,
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setAnswer({
      questionID: docID,
      values: userAnswer?.values ?? [],
      isValid: false,
      isFocused: true,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const isValid = userAnswer.values.reduce(
      (res: boolean, item: { optionID: string | number; value: string }) => {
        return res && textFieldConfig.regExp.test(item.value);
      },
      true
    );
    setAnswer({
      questionID: docID,
      values: userAnswer.values,
      isValid: isValid,
      isFocused: false,
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
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </FormControl>
        );
      })}
    </>
  );
};

export default FreeListView;
