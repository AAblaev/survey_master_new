import { IAnswer, IPage, IUserAnswer } from "../types";

export const isQuestionDone = (answer: IAnswer) => {
  return answer.values.length !== 0;
};

export const isQuestionViewedAndDone = (
  docID: number,
  userAnswers: IUserAnswer
) => {
  return (
    userAnswers.hasOwnProperty(docID) && isQuestionDone(userAnswers[docID])
  );
};

export const isRequiredQuestionDone = (
  pages: IPage[],
  userAnswers: IUserAnswer
) => {
  return !Boolean(
    pages.find((page) =>
      page.questions.find(
        (q) => q.isRequired && !isQuestionViewedAndDone(q.docID, userAnswers)
      )
    )
  );
};
