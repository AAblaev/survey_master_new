import React from "react";
import FormControl from "@material-ui/core/FormControl";
import { IAnswer, IOption, IQuestion, IState } from "../../../types";
import { MenuItem, Select } from "@material-ui/core";
import { css } from "@emotion/react";

type IDropDownViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
};

export const formControlCss = css`
  width: 100%;
`;

export const chipWrapperCss = css``;
export const chipCss = css``;

const DropDownView: React.FC<IDropDownViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;

  const options = config.options!;
  const optionsDict = options.reduce(
    (res, option) => ({ ...res, [`${option.docID}`]: option }),
    {}
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
        },
      ],
    });
  };

  return (
    <FormControl variant="standard" css={formControlCss}>
      <Select
        value={value}
        onChange={handleChange}
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
        renderValue={(value: any) => `${optionsDict[value].title}`}
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
