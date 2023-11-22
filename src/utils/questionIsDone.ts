import { IAnswer, IPage, IQuestion, IUserAnswer } from "../types";

export const isQuestionDone = (answer: IAnswer) => {
  return answer.values.length !== 0;
};

export const questionValidation = (
  question: IQuestion,
  userAnswers: IUserAnswer
) => {
  return (
    userAnswers.hasOwnProperty(question.docID) &&
    userAnswers[question.docID].values.length > 0 &&
    !userAnswers[question.docID].values.some((v) => !v.validationResult.isValid)
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
  hasRequiredRowsAndColumns: boolean
): boolean => {
  if (isFocused) {
    // console.log("isFocused");
    return false;
  }

  if (isValid && isLogicalValiditySuccess && hasRequiredRowsAndColumns) {
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

  if (isRequired && !hasRequiredRowsAndColumns && !pageIsVisited) {
    // console.log("isRequired && isEmpty && !pageIsVisited");
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
