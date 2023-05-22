import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { setAnswer } from "../../services/redux/actions";
import { IAnswer, IDataType, IQuestion, IState } from "../../types";
import { freeQuestionCss } from "./sc";
import FreeView from "./views/free";
import FreeListView from "./views/free-list";
import DropDownView from "./views/dropDown";
import MultiDropDownView from "./views/multiDropDown";
import ScaleView from "./views/scale/scale";
import SelectView from "./views/select";

import { css } from "@emotion/react";
import { Card, Typography } from "@material-ui/core";
import { PRIMARY_COLOR } from "../../consts/const";

export type OwnProps = {
  key: number;
  currentQuestionIndex: number;
  question: IQuestion;
};
export type StateProps = ReturnType<typeof mapStateToProps>;
export type DispatchProps = ReturnType<typeof mapDispathToProps>;

type IQuestionProps = StateProps & OwnProps & DispatchProps;

const cardCss = css`
  padding: 20px;
`;
const titleCss = css`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;
const titleCountCss = css`
  font-size: 1.2rem;
  color: ${PRIMARY_COLOR};
  font-weight: bold;
`;
const titleTextCss = css`
  font-size: 1.2rem;
`;

const Question: React.FC<IQuestionProps> = ({
  currentQuestionIndex,
  question,
  userAnswer,
  setAnswer,
}) => {
  const { title, config } = question;
  const questionType = config.dataType;

  const renderQuestionView = (questionType: IDataType) => {
    switch (questionType) {
      case "free": {
        return (
          <FreeView
            currentQuestionIndex={currentQuestionIndex}
            question={question}
            userAnswer={userAnswer as IAnswer}
            setAnswer={setAnswer}
          />
        );
      }

      case "freelist": {
        return (
          <FreeListView
            currentQuestionIndex={currentQuestionIndex}
            question={question}
            userAnswer={userAnswer as IAnswer}
            setAnswer={setAnswer}
          />
        );
      }

      case "dropdown": {
        return (
          <DropDownView
            currentQuestionIndex={currentQuestionIndex}
            question={question}
            userAnswer={userAnswer as IAnswer}
            setAnswer={setAnswer}
          />
        );
      }

      case "multidropdown": {
        return (
          <MultiDropDownView
            currentQuestionIndex={currentQuestionIndex}
            question={question}
            userAnswer={userAnswer as IAnswer}
            setAnswer={setAnswer}
          />
        );
      }
      case "scale": {
        return (
          <ScaleView
            currentQuestionIndex={currentQuestionIndex}
            question={question}
            userAnswer={userAnswer as IAnswer}
            setAnswer={setAnswer}
          />
        );
      }
      case "select":
      case "multiselect": {
        return (
          <SelectView
            currentQuestionIndex={currentQuestionIndex}
            question={question}
            userAnswer={userAnswer as IAnswer}
            setAnswer={setAnswer}
          />
        );
      }

      default: {
        return <div>Данного типа вопроса нет {questionType}</div>;
      }
    }
  };

  return (
    <div>
      <div css={titleCss}>
        <div css={titleCountCss}>{currentQuestionIndex + 1}.</div>
        <div css={titleTextCss}>{title}</div>
      </div>

      <Card css={cardCss}>
        <FormControl css={freeQuestionCss} focused={false}>
          {renderQuestionView(questionType)}
        </FormControl>
      </Card>
    </div>
  );
};

const mapStateToProps = (state: IState, props: OwnProps) => {
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

export default connect(mapStateToProps, mapDispathToProps)(Question);
