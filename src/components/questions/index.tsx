import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import { setAnswer } from "../../services/redux/actions";
import { IAnswer, IQuestion, IState } from "../../types";
import {
  cardCss,
  formControlCss,
  titleCountCss,
  titleCss,
  titleTextCss,
} from "./sc";
import FreeView from "./views/free";
import FreeListView from "./views/free-list";
import DropDownView from "./views/dropDown";
import MultiDropDownView from "./views/multiDropDown";
import ScaleView from "./views/scale/scale";
import SelectView from "./views/select";
import MatrixView from "./views/matrix";

import { EXTRA_ANSWER } from "../../consts/const";
import Html from "./views/html";
import NothingCheckbox from "./extra/nothingCheckbox";
import UnableCheckbox from "./extra/unableCheckbox";
import OtherCheckbox from "./extra/otherCheckbox";

export type OwnProps = {
  key: number;
  currentQuestionIndex: number;
  question: IQuestion;
};
export type StateProps = ReturnType<typeof mapStateToProps>;
export type DispatchProps = ReturnType<typeof mapDispathToProps>;
type IQuestionProps = StateProps & OwnProps & DispatchProps;

const viewDict = {
  free: FreeView,
  freelist: FreeListView,
  dropdown: DropDownView,
  multidropdown: MultiDropDownView,
  scale: ScaleView,
  select: SelectView,
  multiselect: SelectView,
  html: Html,
  matrix: MatrixView,
};

export const extraFilter = (userAnswer: IAnswer): IAnswer => {
  const extraIdsArr = Object.values(EXTRA_ANSWER);
  return {
    questionID: userAnswer.questionID,
    values: userAnswer.values.filter(
      (option) => !extraIdsArr.includes(option.optionID)
    ),
  };
};

const Question: React.FC<IQuestionProps> = ({
  currentQuestionIndex,
  question,
  userAnswer: answerWithExtra,
  setAnswer,
}) => {
  const {
    title,
    config,
    hasNothingAnswer,
    hasOtherAnswer,
    hasUnableAnswer,
    isRequired,
  } = question;
  const questionText = `<div>${title}${
    isRequired ? '<span style="color:red;">*</span>' : ""
  }</div>`;
  const hasExtra = hasNothingAnswer || hasOtherAnswer || hasUnableAnswer;
  const questionType = config.dataType as keyof typeof viewDict;
  const ViewComponent = viewDict[questionType];
  const isImplementedQuestionType = viewDict.hasOwnProperty(questionType);
  const needPadding =
    questionType === "freelist" ||
    questionType === "select" ||
    questionType === "multiselect" ||
    questionType === "html" ||
    questionType === "matrix" ||
    !isImplementedQuestionType;
  const userAnswer =
    answerWithExtra && hasExtra
      ? extraFilter(answerWithExtra)
      : answerWithExtra;

  const disabled = Boolean(
    answerWithExtra &&
      Boolean(
        answerWithExtra.values.find(
          (ans) => ans.optionID === EXTRA_ANSWER.UNABLE
        )
      )
  );

  return (
    <div>
      <div css={titleCss(disabled)}>
        <div css={titleCountCss}>{currentQuestionIndex + 1}.</div>
        <div css={titleTextCss}>
          <div dangerouslySetInnerHTML={{ __html: questionText }}></div>
        </div>
      </div>

      <div css={cardCss(needPadding)}>
        <FormControl
          css={formControlCss({
            disabled,
            noBorderOnInput: questionType === "free",
          })}
          focused={false}
        >
          {isImplementedQuestionType ? (
            <ViewComponent
              currentQuestionIndex={currentQuestionIndex}
              question={question}
              userAnswer={userAnswer as IAnswer}
              setAnswer={setAnswer}
            />
          ) : (
            <div>Данного типа вопроса нет {questionType}</div>
          )}
          {hasNothingAnswer && (
            <NothingCheckbox
              userAnswer={answerWithExtra as IAnswer}
              setAnswer={setAnswer}
              questionID={question.docID}
            />
          )}
          {hasOtherAnswer && (
            <OtherCheckbox
              userAnswer={answerWithExtra as IAnswer}
              setAnswer={setAnswer}
              questionID={question.docID}
            />
          )}
        </FormControl>
      </div>
      {hasUnableAnswer && (
        <UnableCheckbox
          userAnswer={answerWithExtra as IAnswer}
          setAnswer={setAnswer}
          questionID={question.docID}
        />
      )}
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
