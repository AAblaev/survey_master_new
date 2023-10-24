import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import {
  setAnswer,
  setNeedScrolling,
  validation,
} from "../../services/redux/actions";
import { IAnswer, IQuestion, IState } from "../../types";
import FreeView from "./views/free";
import FreeListView from "./views/free-list";
import DropDownView from "./views/dropDown";
import MultiDropDownView from "./views/multiDropDown";
import ScaleView from "./views/scale/scale";
import SelectView from "./views/select";
import MatrixView from "./views/matrix";
import { EXTRA_ANSWER, TIMEOUT_VALUE } from "../../consts/const";
import Html from "./views/html";
import NothingCheckbox from "./extra/nothingCheckbox";
import UnableCheckbox from "./extra/unableCheckbox";
import OtherCheckbox from "./extra/otherCheckbox";
import { getNeedCorrect } from "../../utils/questionIsDone";
import {
  cardCss,
  formControlCss,
  titleCountCss,
  titleCss,
  titleTextCss,
  commentCss,
  limitMessageCss,
  limitMessageWrapperCss,
} from "./sc";
import { visibleChecking } from "../../utils/rule-utils";

export type OwnProps = {
  index: number;
  pageID: number;
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
  selectedQuestion,
  setScrolling,
  pageID,
  isVisible,
  isLogicalValiditySuccess,
}) => {
  const {
    docID,
    title,
    config,
    hasNothingAnswer,
    hasOtherAnswer,
    hasUnableAnswer,
    hasComment,
    comment,
    isRequired,
    difficultToAnswerPlaceholder,
    nothingPlaceholder,
    otherPlaceholder,
  } = question;
  const elementRef = useRef<any>(null);

  const { isLimited, isLimitedValue, limit, limitValue } = config;
  const questionText = `<div>${title}${
    isRequired ? '<span style="color:red;">*</span>' : ""
  } `;
  // docID=${docID}</div>
  const hasExtra = hasNothingAnswer || hasOtherAnswer || hasUnableAnswer;
  const otherInAnswer = answerWithExtra?.values.some(
    (v) => v.optionID === EXTRA_ANSWER.OTHER
  );

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
  // console.log("title", title);
  // console.log("isFocused", isFocused);
  const isValid =
    !!answerWithExtra &&
    answerWithExtra.values.length > 0 &&
    !answerWithExtra.values.some((v) => !v.validationResult.isValid);

  const pageIsVisited = visitedPageDocIDList.includes(String(pageID));

  const needCorrect = getNeedCorrect(
    isRequired,
    isEmpty,
    isFocused,
    isValid,
    pageIsVisited,
    isLogicalValiditySuccess
  );

  const userAnswerResult = isInternalExtra
    ? (answerWithExtra as IAnswer)
    : (userAnswer as IAnswer);

  useEffect(() => {
    if (!isVisible && !isEmpty) {
      setAnswer({ questionID: docID, values: [] });
    }
  }, [isVisible]);

  useEffect(() => {
    if (selectedQuestion && elementRef.current) {
      setTimeout(() => {
        elementRef.current.scrollIntoView({
          block: "start",
          behavior: "auto",
        });
        setScrolling(false);
      }, 0);
    }
  }, [selectedQuestion]);
  if (!isVisible) return null;
  return (
    <div ref={selectedQuestion ? elementRef : null} id={`docID${docID}`}>
      <div css={titleCss(disabled)}>
        <div css={titleCountCss}></div>
        <div css={titleTextCss(needCorrect)}>
          <div dangerouslySetInnerHTML={{ __html: questionText }}></div>
        </div>
      </div>

      {(isLimited || isLimitedValue) && (
        <div css={limitMessageWrapperCss}>
          {isLimited && (
            <span
              css={limitMessageCss}
            >{`Длина текста должна составлять не менее ${limit?.min} и не более ${limit?.max} символов. `}</span>
          )}

          {isLimitedValue && (
            <span css={limitMessageCss}>
              {`Текст ответа должен быть числом. Значение числа должно быть не менее ${limitValue?.min} и не более ${limitValue?.max}.`}
            </span>
          )}
        </div>
      )}

      {hasComment && (
        <div
          css={commentCss(disabled)}
          dangerouslySetInnerHTML={{ __html: comment ? comment : "" }}
        ></div>
      )}
      <div css={cardCss(needPadding || Boolean(otherInAnswer))}>
        <FormControl
          css={formControlCss({
            disabled,
            noBorderOnInput: false,
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
              otherPlaceholder={otherPlaceholder}
            />
          )}
          {!isInternalExtra && hasNothingAnswer && (
            <NothingCheckbox
              userAnswer={answerWithExtra as IAnswer}
              setAnswer={setAnswer}
              questionID={question.docID}
              nothingPlaceholder={nothingPlaceholder}
            />
          )}
        </FormControl>
      </div>

      {hasUnableAnswer && (
        <UnableCheckbox
          userAnswer={answerWithExtra as IAnswer}
          setAnswer={setAnswer}
          questionID={question.docID}
          difficultToAnswerPlaceholder={difficultToAnswerPlaceholder}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: IState, props: OwnProps) => {
  const {
    userAnswers,
    visitedPageDocIDList,
    location,
    needScrolling,
    visiblityRulesDict,
    logicalValidityCheckRuleDict,
    dependentQuestionsDict,
  } = state;
  const { question } = props;
  const { docID } = question;
  const { questionIndex } = location;
  const isVisilbe = visibleChecking(
    userAnswers,
    visiblityRulesDict[String(docID)]
  );

  const checkingResultArr = dependentQuestionsDict[String(docID)]
    ? dependentQuestionsDict[String(docID)].map(
        (ruleDocID) => logicalValidityCheckRuleDict[ruleDocID].status
      )
    : [];

  const isLogicalValiditySuccess = checkingResultArr.every((status) => status);
  // selectedQuestion
  // disabled
  // needCorrect
  // questionText
  // isLimited
  // isLimitedValue
  // hasComment
  // comment
  // needPadding
  // hasUnableAnswer
  // hasNothingAnswer
  // hasOtherAnswer
  // otherInAnswer
  // isImplementedQuestionType
  // questionType
  // isInternalExtra
  return {
    userAnswer: userAnswers[docID] ? userAnswers[docID] : null,
    visitedPageDocIDList,
    selectedQuestion: needScrolling && questionIndex === props.index,
    isVisible: isVisilbe,
    isLogicalValiditySuccess,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    setScrolling: (value: boolean) => dispatch(setNeedScrolling(value)),
    setAnswer: (answer: IAnswer) => dispatch(setAnswer(answer)),
    validation: (question: IQuestion, optionID?: string) =>
      dispatch(validation({ question, optionID })),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(Question);
