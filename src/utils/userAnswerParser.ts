import { IUserAnswer } from "../types";
// отфильтровать валидные
// values: userAnswers[docID].values.filter((v) => v.validationResult.isValid),

export const userAnswerParses = (userAnswers: IUserAnswer) => {
  const docIDs = Object.keys(userAnswers);
  return docIDs.map((docID) => ({
    questionID: docID,
    values: userAnswers[docID].values,
  }));
};
