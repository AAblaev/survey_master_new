import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { setAnswer } from "../../../services/redux/actions";
import { IAnswer, IOption, IQuestion, IState } from "../../../types";
import { selectQuestionCss } from "../sc";
import {
  Chip,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Theme,
} from "@material-ui/core";
import { css } from "@emotion/react";

type IMultiDropDownViewProps = {
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

const MultiDropDownView: React.FC<IMultiDropDownViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, title, config } = question;
  const options = config.options!;
  const optionsDict = options.reduce(
    (res, option) => ({ ...res, [`${option.docID}`]: option }),
    {}
  ) as { [key: string]: IOption };

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const value = userAnswerExist
    ? (userAnswer as IAnswer).values.map((item) => item.optionID)
    : [];

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const optionIDs = e.target.value as number[];

    const newValue = optionIDs.map((optionID) => ({
      optionID: optionID,
      value: String(optionsDict[optionID].title),
    }));

    setAnswer({
      questionID: docID,
      values: newValue,
    });
  };

  return (
    <FormControl variant="standard" css={formControlCss}>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        renderValue={(items) => {
          const ids = items as number[];
          const options = ids.map((id: number) => optionsDict[id]);
          return (
            <div css={chipWrapperCss}>
              {options.map(({ docID, title }) => (
                <Chip key={docID} label={title} css={chipCss} />
              ))}
            </div>
          );
        }}
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

export default MultiDropDownView;
