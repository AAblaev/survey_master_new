import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import { setAnswer, validation } from "../../services/redux/actions";
import { IAnswer, IQuestion, IState } from "../../types";
import {
  cardCss,
  formControlCss,
  titleCountCss,
  titleCss,
  titleTextCss,
  commentCss,
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
import { getNeedCorrect } from "../../utils/questionIsDone";

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

export const extraFilter = (
  userAnswer: IAnswer,
  omit?: keyof typeof EXTRA_ANSWER
): IAnswer => {
  const extraIdsArr = Object.values(EXTRA_ANSWER);
  return {
    questionID: userAnswer.questionID,
    values: userAnswer.values.filter(
      (option) =>
        !extraIdsArr.includes(option.optionID) ||
        (omit && option.optionID === EXTRA_ANSWER[omit])
    ),
  };
};

const Question: React.FC<IQuestionProps> = ({
  currentQuestionIndex,
  question,
  userAnswer: answerWithExtra,
  setAnswer,
  validation,
  visitedPageDocIDList,
}) => {
  const {
    title,
    config,
    hasNothingAnswer,
    hasOtherAnswer,
    hasUnableAnswer,
    hasComment,
    comment,
    isRequired,
  } = question;

  // console.log("answerWithExtra", answerWithExtra);
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

  const isInternalExtra =
    questionType === "dropdown" || questionType === "multidropdown";

  const userAnswer =
    answerWithExtra && hasExtra
      ? extraFilter(answerWithExtra)
      : answerWithExtra;

  const userAnswerForSelect =
    answerWithExtra && extraFilter(answerWithExtra, "OTHER");

  const disabled = Boolean(
    answerWithExtra &&
      Boolean(
        answerWithExtra.values.find(
          (ans) => (ans.optionID as number) === EXTRA_ANSWER.UNABLE
        )
      )
  );

  const isEmpty =
    !answerWithExtra ||
    answerWithExtra.values.length === 0 ||
    (questionType === "freelist" &&
      !answerWithExtra.values.some((v) => v.value !== ""));
  const isFocused =
    !!answerWithExtra && answerWithExtra.values.some((v) => v.isFocused);
  const isValid =
    !!answerWithExtra &&
    answerWithExtra.values.length > 0 &&
    !answerWithExtra.values.some((v) => !v.validationResult.isValid);
  const pageIsVisited = visitedPageDocIDList.includes(String(question.pageID));

  const needCorrect = getNeedCorrect(
    isRequired,
    isEmpty,
    isFocused,
    isValid,
    pageIsVisited
  );

  const userAnswerResult = isInternalExtra
    ? (answerWithExtra as IAnswer)
    : (userAnswer as IAnswer);

  return (
    <div>
      <div css={titleCss(disabled)}>
        <div css={titleCountCss}>{currentQuestionIndex}.</div>
        <div css={titleTextCss(needCorrect)}>
          <div dangerouslySetInnerHTML={{ __html: questionText }}></div>
        </div>
      </div>
      {hasComment && (
        <div
          css={commentCss(disabled)}
          dangerouslySetInnerHTML={{ __html: comment ? comment : "" }}
        ></div>
      )}
      <div css={cardCss(needPadding || hasExtra)}>
        <FormControl
          css={formControlCss({
            disabled,
            noBorderOnInput: false,
            // noBorderOnInput: questionType === "free",
          })}
          focused={false}
        >
          {isImplementedQuestionType ? (
            <ViewComponent
              currentQuestionIndex={currentQuestionIndex}
              question={question}
              userAnswer={
                questionType === "select" || questionType === "multiselect"
                  ? (userAnswerForSelect as IAnswer)
                  : (userAnswerResult as IAnswer)
              }
              setAnswer={setAnswer}
              needCorrect={needCorrect}
              validation={validation}
            />
          ) : (
            <div>Данного типа вопроса нет {questionType}</div>
          )}
          {!isInternalExtra && hasOtherAnswer && (
            <OtherCheckbox
              userAnswer={answerWithExtra as IAnswer}
              setAnswer={setAnswer}
              questionID={question.docID}
              singleAnswer={questionType !== "multiselect"}
            />
          )}
          {!isInternalExtra && hasNothingAnswer && (
            <NothingCheckbox
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
  const { userAnswers, visitedPageDocIDList } = state;
  const { question } = props;
  const { docID } = question;

  return {
    userAnswer: userAnswers[docID] ? userAnswers[docID] : null,
    visitedPageDocIDList,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    setAnswer: (answer: IAnswer) => dispatch(setAnswer(answer)),
    validation: (question: IQuestion, optionID?: string) =>
      dispatch(validation({ question, optionID })),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(Question);
