import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { IAnswer, IQuestion } from "../../../types";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import Tooltip from "@material-ui/core/Tooltip";
import { css } from "@emotion/react";
import {
  getTextFieldConfig,
  REGEXP_DICT,
  validation,
} from "../../../utils/validation";

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
  & .MuiFilledInput-multiline {
    padding: 5px;
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

  const values = userAnswerExist
    ? userAnswer.values
    : options.map((option) => ({
        optionID: option.docID,
        value: "",
        validationResult: { isValid: true, message: "ошибка" },
        isFocused: false,
      }));
  // console.log(textFieldConfig);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    item: typeof options[0]
  ) => {
    if (
      (simpleType === "integer" || simpleType === "float") &&
      !REGEXP_DICT["float"].test(e.target.value)
    ) {
      return;
    }

    const newValue = values.map((value) => {
      if (value.optionID === item.docID) {
        return {
          optionID: value.optionID,
          value: e.target.value,
          validationResult: { isValid: false, message: "ошибка" },
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
          validationResult: value.validationResult,
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

    const newValue = values.map((value) => {
      if (value.optionID === item.docID) {
        console.log("simpleType", simpleType);
        const validationResult = validation({
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
          validationResult: validationResult,
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
        const answerExist = Boolean(answer && userAnswerExist);
        // const alarm =
        //   Boolean(needCorrect) &&
        //   !textFieldConfig.regExp.test((answer && answer.value) || "");

        // console.log("alarm", alarm);
        const value = answer ? answer.value : "";
        const showAlert =
          answerExist &&
          !answer!.validationResult.isValid &&
          !answer!.isFocused;
        const validationMessage = answerExist
          ? answer!.validationResult.message
          : "";

        return (
          <FormControl key={item.docID} css={freeListItemCss}>
            <FormLabel component="legend" css={freeListItemLabelCss}>
              {item.title}
            </FormLabel>
            <TextField
              InputProps={{
                disableUnderline: true,
                endAdornment: showAlert && (
                  <InputAdornment position="end">
                    <Tooltip title={validationMessage}>
                      <IconButton>
                        <ErrorIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              color="primary"
              variant="filled"
              css={borderColorCss(showAlert)}
              value={value}
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
