import { ILocation, IResultCheckingRules } from "../types";
import { findFirstIncompleteQuestion } from "./questionIsDone";

export type IGetFirstLocationWithDeviation = (
  firstIncompleteQuestion: ReturnType<typeof findFirstIncompleteQuestion>,
  resultCheckingRules: IResultCheckingRules
) => ILocation;

export const getFirstLocationWithDeviation: IGetFirstLocationWithDeviation = (
  firstIncompleteQuestion,
  resultCheckingRules
) => {
  if (firstIncompleteQuestion && !resultCheckingRules.status) {
    return {
      pathName: "section",
      title: "section",
      pageIndex: resultCheckingRules.deviationPageIndex,
      questionIndex: 0,
    };
  }

  if (resultCheckingRules.status && Boolean(firstIncompleteQuestion)) {
    return {
      pathName: "section",
      title: "section",
      pageIndex: firstIncompleteQuestion!.pageIndex,
      questionIndex: 0,
    };
  }

  const location: ILocation = {
    pathName: "section",
    title: "section",
    pageIndex: Math.min(
      resultCheckingRules.deviationPageIndex,
      firstIncompleteQuestion
        ? firstIncompleteQuestion.pageIndex
        : resultCheckingRules.deviationPageIndex
    ),
    questionIndex: 0,
  };
  return location;
};
