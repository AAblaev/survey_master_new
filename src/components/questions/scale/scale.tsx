import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { setAnswer } from "../../../services/redux/actions";
import { IAnswer, IState } from "../../../types";
import { ICommonQuestionProps } from "../common-question.types";
import { optionCss, optionsCss, rootCss } from "./scale-sc";

type IStateProps = ReturnType<typeof mapStateToProps>;
type IDispatchProps = ReturnType<typeof mapDispathToProps>;
type IScaleProps = IStateProps & IDispatchProps & ICommonQuestionProps;

const Scale: React.FC<IScaleProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, title, config } = question;
  const options = config.options!;
  const label = `${currentQuestionIndex + 1}. ${title}`;
  const selected =
    userAnswer && userAnswer.values.length > 0 ? userAnswer.values[0] : null;
  const horizontal = true;

  const onClick = (item: typeof options[0]) => {
    setAnswer({
      questionID: docID,
      values: [{ optionID: item.docID, value: "" }],
    });
  };

  return (
    <FormControl css={rootCss}>
      <FormLabel component="legend">{label}</FormLabel>
      <div css={optionsCss(horizontal)}>
        {options.map((item) => {
          return (
            <div
              key={item.docID}
              css={optionCss(
                selected !== null && selected.optionID === item.docID
              )}
              onClick={() => onClick(item)}
            >
              {item.title}
            </div>
          );
        })}
      </div>
    </FormControl>
  );
};

const mapStateToProps = (state: IState, props: ICommonQuestionProps) => {
  const { userAnswers } = state;
  const { question } = props;
  const { docID } = question;
  return { userAnswer: userAnswers[docID] ? userAnswers[docID] : null };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    setAnswer: (answer: IAnswer) => dispatch(setAnswer(answer)),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(Scale);
