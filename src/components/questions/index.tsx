import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import { setAnswer } from "../../services/redux/actions";
import { IAnswer, IQuestion, IState } from "../../types";
import { freeQuestionCss } from "./sc";
import FreeView from "./views/free";
import FreeListView from "./views/free-list";
import DropDownView from "./views/dropDown";
import MultiDropDownView from "./views/multiDropDown";
import ScaleView from "./views/scale/scale";
import SelectView from "./views/select";

import { css } from "@emotion/react";
import { Card } from "@material-ui/core";
import { PRIMARY_COLOR } from "../../consts/const";
import Html from "./views/html";
import NotAnyOne from "./extra/notAnyone";

export type OwnProps = {
  key: number;
  currentQuestionIndex: number;
  question: IQuestion;
};
export type StateProps = ReturnType<typeof mapStateToProps>;
export type DispatchProps = ReturnType<typeof mapDispathToProps>;

type IQuestionProps = StateProps & OwnProps & DispatchProps;

const cardCss = (needPadding: boolean) => css`
  ${needPadding && `padding: 20px;`}
  background-color: #fff;
  border: 1px solid #bdbdbd;
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

const viewDict = {
  free: FreeView,
  freelist: FreeListView,
  dropdown: DropDownView,
  multidropdown: MultiDropDownView,
  scale: ScaleView,
  select: SelectView,
  multiselect: SelectView,
  html: Html,
};

const Question: React.FC<IQuestionProps> = ({
  currentQuestionIndex,
  question,
  userAnswer,
  setAnswer,
}) => {
  const { title, config } = question;
  const questionType = config.dataType as keyof typeof viewDict;
  const ViewComponent = viewDict[questionType];
  const isRealisedTypeOfQuestion = viewDict.hasOwnProperty(questionType);
  const needPadding = questionType !== "scale";

  return (
    <div>
      <div css={titleCss}>
        <div css={titleCountCss}>{currentQuestionIndex + 1}.</div>
        <div css={titleTextCss}>{title}</div>
      </div>

      <div css={cardCss(needPadding)}>
        <FormControl css={freeQuestionCss} focused={false}>
          {isRealisedTypeOfQuestion ? (
            <>
              <ViewComponent
                currentQuestionIndex={currentQuestionIndex}
                question={question}
                userAnswer={userAnswer as IAnswer}
                setAnswer={setAnswer}
              />
            </>
          ) : (
            <div>Данного типа вопроса нет {questionType}</div>
          )}
        </FormControl>
      </div>
    </div>
  );
};
// <NotAnyOne />

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
