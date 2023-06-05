import { IAnswer, IDataType, IPage, IQuestion, IUserAnswer } from "../types";

export const isQuestionDone = (answer: IAnswer) => {
  return answer.values.length !== 0;
};
//
// export const isQuestionViewedAndDone = (
//   docID: number,
//   userAnswers: IUserAnswer
// ) => {
//   return (
//     userAnswers.hasOwnProperty(docID) && isQuestionDone(userAnswers[docID])
//   );
// };
//
// export const isRequiredQuestionDone = (
//   pages: IPage[],
//   userAnswers: IUserAnswer
// ) => {
//   return !Boolean(
//     pages.find((page) =>
//       page.questions.find(
//         (q) => q.isRequired && !isQuestionViewedAndDone(q.docID, userAnswers)
//       )
//     )
//   );
// };

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
