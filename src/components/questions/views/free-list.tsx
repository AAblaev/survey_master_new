import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { IAnswer, IQuestion } from "../../../types";
import { TextField } from "@material-ui/core";
import { css } from "@emotion/react";

export const freeListItemCss = css`
  margin-top: 10px !important;
  margin-bottom: 10px !important;
`;

export const freeListItemLabelCss = css`
  font-size: 0.8rem !important;
  // color: #787878 !important;
  margin-bottom: 0.5em;
`;

type IFreeListViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
};

const FreeListView: React.FC<IFreeListViewProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const options = config.options!;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
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
      isValid: true,
      isFocused: false,
    });
  };

  return (
    <>
      {options.map((item, i) => {
        const answer = userAnswer?.values.find(
          (answer) => answer.optionID === item.docID
        );
        return (
          <FormControl key={item.docID} css={freeListItemCss}>
            <FormLabel component="legend" css={freeListItemLabelCss}>
              {item.title}
            </FormLabel>
            <TextField
              InputProps={{ disableUnderline: true }}
              color="primary"
              variant="filled"
              value={(answer && answer.value) || ""}
              hiddenLabel
              onChange={(e) => onChange(e, item)}
            />
          </FormControl>
        );
      })}
    </>
  );
};

export default FreeListView;
