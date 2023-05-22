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

export type OwnProps = {
  key: number;
  currentQuestionIndex: number;
  question: IQuestion;
};
export type StateProps = ReturnType<typeof mapStateToProps>;
export type DispatchProps = ReturnType<typeof mapDispathToProps>;

type IQuestionProps = StateProps & OwnProps & DispatchProps;

const Question: React.FC<IQuestionProps> = ({
  currentQuestionIndex,
  question,
  userAnswer,
  setAnswer,
}) => {
  const { title, config } = question;
  const questionType = config.dataType;
  const freeListLabel = `${currentQuestionIndex + 1}. ${title}`;

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
    <FormControl css={freeQuestionCss} focused={false}>
      <FormLabel component="legend">{freeListLabel}</FormLabel>
      {renderQuestionView(questionType)}
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

export default connect(mapStateToProps, mapDispathToProps)(Question);
