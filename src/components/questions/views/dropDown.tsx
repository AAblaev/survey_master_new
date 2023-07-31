import React from "react";
import FormControl from "@material-ui/core/FormControl";
import { IAnswer, IOption, IQuestion } from "../../../types";
import { MenuItem, Select } from "@material-ui/core";
import { css } from "@emotion/react";
import { DEFAULT_HINT_VALUE } from "../../../consts/const";

type IDropDownViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
  validation: (question: IQuestion) => void;
};

export const formControlCss = css`
  width: 100%;
`;

export const renderValueCss = (isDefault: boolean) =>
  css`
    color: ${isDefault ? "#555" : "inherit"};
    padding: 0.5em;
  `;

export const chipWrapperCss = css``;
export const chipCss = css``;

const DropDownView: React.FC<IDropDownViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config, hint } = question;

  const options = config.options!;
  const optionsDict = options.reduce(
    (res, option) => ({ ...res, [`${option.docID}`]: option }),
    {
      default: {
        docID: -1,
        height: 0,
        order: 0,
        photoID: 0,
        title: hint ? hint : DEFAULT_HINT_VALUE,
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
          value: String(optionsDict[optionID].title),
          isValid: true,
          isFocused: false,
        },
      ],
    });
  };

  return (
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
              {value === ""
                ? optionsDict["default"].title
                : optionsDict[value].title}
            </span>
          );
        }}
      >
        {options.map((item) => (
          <MenuItem key={item.docID} value={item.docID}>
            {item.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropDownView;
