import React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { IAnswer, IQuestion } from "../../../types";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import { css } from "@emotion/react";
import { REGEXP_DICT, validation } from "../../../utils/validation";

export const textFieldWrapperCss = css`
  display: flex;
  align-items: center;
  position: relative;
`;

export const alertCss = css`
  position: absolute;
  top: 0px;
  right: -40px;
  z-index: 1000000000;
`;

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
  & .MuiInputBase-root {
    border-radius: 0px;
  }
  & .MuiInputBase-input {
    padding: 5px;
    border: 0px solid red;
  }
  & .Mui-focused {
  }

  & .MuiInputBase-input:focus {
  }
  & .MuiFilledInput-root {
    ${alarm && `border-color:red`}
  }
  & .MuiFilledInput-multiline {
    border: 0px solid red;
  }
  & .MuiFilledInput-root.Mui-focused {
    background-color: #fff;
    box-shadow: #46acaf;
    border-color: #e5e5e5;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: 0px solid red;
    border-size: 0px;
  }

  &
    .MuiInputBase-root-MuiOutlinedInput-root.Mui-focused.MuiOutlinedInput-notchedOutline {
    border-size: 0px;
  }

  & > fieldset {
    border-size: 0px;
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
  question,
  setAnswer,
  userAnswer,
  needCorrect,
}) => {
  const { docID, config } = question;
  const {
    simpleType,
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
    isMultiline,
  } = config;
  const options = config.options!;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;

  const values = userAnswerExist ? userAnswer.values : [];

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
    const isFieldEmpty = !values.some((v) => v.optionID === item.docID);

    const newValue = isFieldEmpty
      ? [
          ...values,
          {
            optionID: item.docID,
            value: "",
            validationResult: { isValid: false, message: "пусто" },
            isFocused: true,
          },
        ]
      : values.map((value) => {
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
    const currentValue = e.target.value;
    if (currentValue.trim() === "") {
      const prevValue = values.filter((v) => v.optionID !== item.docID);

      setAnswer({
        questionID: docID,
        values: prevValue,
      });
      return;
    }

    const newValue = values.map((value) => {
      if (value.optionID === item.docID) {
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
              multiline={isMultiline}
              minRows={4}
              maxRows={4}
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
//
// endAdornment: showAlert && (
//   <InputAdornment position="end">
//     <Tooltip title={validationMessage}>
//       <IconButton>
//         <ErrorIcon />
//       </IconButton>
//     </Tooltip>
//   </InputAdornment>
// ),
