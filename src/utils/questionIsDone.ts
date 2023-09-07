import { EXTRA_ANSWER } from "../consts/const";
import {
  IAnswer,
  IEvent,
  IPage,
  IQuestion,
  IRule,
  IUserAnswer,
  IVisibilityQuestionRule,
} from "../types";

export const isQuestionDone = (answer: IAnswer) => {
  return answer.values.length !== 0;
};

export const questionValidation = (
  question: IQuestion,
  userAnswers: IUserAnswer
) => {
  return (
    userAnswers.hasOwnProperty(question.docID) &&
    userAnswers[question.docID].values.length > 0
  );
};

export const findFirstIncompleteQuestion = (
  pages: IPage[],
  userAnswers: IUserAnswer
): { pageIndex: number; questionIndex: number } | null => {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    for (let j = 0; j < page.questions.length; j++) {
      const question = page.questions[j];
      const isRequiredAndNotAnswer =
        question.isRequired && !questionValidation(question, userAnswers);
      if (isRequiredAndNotAnswer) {
        return { pageIndex: i, questionIndex: j };
      }
    }
  }
  return null; // Возвращаем null, если все вопросы выполнены
};

export const getNeedCorrect = (
  isRequired: boolean,
  isEmpty: boolean,
  isFocused: boolean,
  isValid: boolean,
  pageIsVisited: boolean
): boolean => {
  if (isFocused || isValid) {
    return false;
  }
  if (!isRequired && isEmpty) {
    return false;
  }

  if (isRequired && isEmpty && !pageIsVisited) {
    return false;
  }

  return true;
};

export const sectionValidtion = (
  page: IPage,
  userAnswers: IUserAnswer
): boolean => {
  const result = !page.questions.some(
    (q) =>
      (q.isRequired && !userAnswers[q.docID]) ||
      (q.isRequired &&
        userAnswers[q.docID] &&
        userAnswers[q.docID].values.length === 0) ||
      (q.isRequired &&
        userAnswers[q.docID] &&
        userAnswers[q.docID].values.some((v) => !v.validationResult.isValid))
  );

  return result;
};

const eventChecking = (event: IEvent, userAnswers: IUserAnswer): boolean => {
  if (event.type === "answeredQuestion") {
    return (
      !!userAnswers[event.questionID] &&
      userAnswers[event.questionID].values.length !== 0
    );
  }
  if (event.type === "skippedQuestion") {
    return !userAnswers[event.questionID];
  }
  if (event.type === "struggledToAnswer") {
    return (
      !!userAnswers[event.questionID] &&
      userAnswers[event.questionID].values.some(
        (v) => v.optionID === EXTRA_ANSWER.UNABLE
      )
    );
  }
  /////
  if (event.type === "selectedOption") {
    return true;
  }
  if (event.type === "formula") {
    return true;
  }
  return true;
};

export const visibleChecking = (
  userAnswers: IUserAnswer,
  rule?: IVisibilityQuestionRule
) => {
  console.log("visiblle checking", userAnswers);
  if (!rule) return true;

  const { events } = rule;
  const operator = events[0].eventOperator;
  if (operator === "AND" || operator === null) {
    return events.every((event) => {
      return eventChecking(event, userAnswers);
    });
  }

  return true;
};
