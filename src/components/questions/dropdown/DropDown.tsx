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

type OwnProps = {
  key: number;
  currentQuestionIndex: number;
  question: IQuestion;
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispathToProps>;

type IFreeQuestionProps = StateProps & OwnProps & DispatchProps;

export const formControlCss = css`
  width: 100%;
`;

export const chipWrapperCss = css``;
export const chipCss = css``;

const DropDownQuestion: React.FC<IFreeQuestionProps> = ({
  currentQuestionIndex,
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
    <FormControl css={selectQuestionCss}>
      <FormLabel id={String(docID)} component="legend">
        {currentQuestionIndex + 1}. {title}
      </FormLabel>

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
    </FormControl>
  );
};

const mapStateToProps = (state: IState, props: OwnProps) => {
  const { userAnswers } = state;
  const { question } = props;
  const { docID } = question;
  return { userAnswer: userAnswers[docID] ? userAnswers[docID] : [] };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    setAnswer: (answer: IAnswer) => dispatch(setAnswer(answer)),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(DropDownQuestion);
