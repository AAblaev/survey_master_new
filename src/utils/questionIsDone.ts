import { IAnswer, IPage, IQuestion, IUserAnswer } from "../types";
import { requiredRowsEndColumnsChecking } from "./validation";

export const isQuestionDone = (answer: IAnswer) => {
  return answer.values.length !== 0;
};

export const isRequiredQuestionHasAnswer = (
  question: IQuestion,
  userAnswers: IUserAnswer
) => {
  return (
    userAnswers.hasOwnProperty(question.docID) &&
    userAnswers[question.docID].values.length > 0
  );
};

export const requiredQuestionsHasAnswer = (
  page: IPage,
  userAnswers: IUserAnswer
) => {
  return page.questions.every(
    (q) => !q.isRequired || (q.isRequired && questionValidation(q, userAnswers))
  );
};

export const requiredQuestionsHasCorrectAnswer = (
  page: IPage,
  userAnswers: IUserAnswer
) => {
  return page.questions.every(
    (q) =>
      !q.isRequired || (q.isRequired && new_questionValidation(q, userAnswers))
  );
};

export const requiredQuestionsHasFullAnswer = (
  page: IPage,
  userAnswers: IUserAnswer
) => {
  return page.questions.every(
    (q) =>
      !q.isRequired ||
      (q.isRequired &&
        requiredRowsEndColumnsChecking(q, userAnswers[q.docID].values))
  );
};

export const new_questionValidation = (
  question: IQuestion,
  userAnswers: IUserAnswer
) => {
  return (
    userAnswers.hasOwnProperty(question.docID) &&
    userAnswers[question.docID].values.length > 0 &&
    userAnswers[question.docID].values.every((v) => v.validationResult.isValid)
  );
};

export const questionValidation = (
  question: IQuestion,
  userAnswers: IUserAnswer
) => {
  return (
    userAnswers.hasOwnProperty(question.docID) &&
    userAnswers[question.docID].values.length > 0 &&
    !userAnswers[question.docID].values.some(
      (v) => !v.validationResult.isValid
    ) &&
    requiredRowsEndColumnsChecking(question, userAnswers[question.docID].values)
  );
};

export const findFirstIncompleteQuestion = (
  pages: IPage[],
  userAnswers: IUserAnswer
): { pageIndex: number; questionIndex: number; pageID: number } | null => {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    for (let j = 0; j < page.questions.length; j++) {
      const question = page.questions[j];
      const isRequiredAndNotAnswer =
        question.isRequired && !questionValidation(question, userAnswers);

      if (isRequiredAndNotAnswer) {
        return { pageIndex: i, questionIndex: j, pageID: page.docID };
      }
    }
  }
  return null; // Возвращаем null, если все вопросы выполнены
};

export const requiredQuestionsChecking = (
  page: IPage,
  userAnswers: IUserAnswer
) => {
  return page.questions.some(
    (q) => q.isRequired && !questionValidation(q, userAnswers)
  );
};

export const getNeedCorrect = (
  isRequired: boolean,
  isEmpty: boolean,
  isFocused: boolean,
  isValid: boolean,
  pageIsVisited: boolean,
  isLogicalValiditySuccess: boolean,
  isReqRowAndColCheckSuccess: boolean,
  hasExtraInAnswer: boolean
): boolean => {
  if (isFocused) {
    // console.log("isFocused");
    return false;
  }

  if (hasExtraInAnswer) {
    // console.log("isUnabled");
    return false;
  }

  if (isValid && isLogicalValiditySuccess && isReqRowAndColCheckSuccess) {
    // console.log("isValid && isLogicalValiditySuccess");
    return false;
  }

  if (!isRequired && isEmpty) {
    // console.log("!isRequired && isEmpty");
    return false;
  }

  // if (!isLogicalValiditySuccess && !pageIsVisited) {
  //   // console.log("!isLogicalValiditySuccess && !pageIsVisited");
  //   return false;
  // }

  if (isRequired && isEmpty && !pageIsVisited) {
    // console.log("isRequired && isEmpty && !pageIsVisited");
    return false;
  }

  if (isRequired && !isReqRowAndColCheckSuccess && !pageIsVisited) {
    // console.log("isRequired && isEmpty && !pageIsVisited");
    return false;
  }

  if (!isRequired && isValid) {
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
