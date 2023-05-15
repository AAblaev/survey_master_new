import { IUserAnswer } from "../types";

export const userAnswerParses = (userAnswers: IUserAnswer) => {
  const docIDs = Object.keys(userAnswers);
  return docIDs.map((docID) => ({
    questionID: docID,
    values: userAnswers[docID],
  }));
};
