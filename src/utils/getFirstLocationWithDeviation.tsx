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
    // console.log("getFirstLocationWithDeviation 1");
    return {
      pathName: "section",
      title: "section",
      pageIndex: resultCheckingRules.deviationPageIndex,
      questionIndex: 0,
    };
  }

  if (resultCheckingRules.status && firstIncompleteQuestion) {
    // console.log("getFirstLocationWithDeviation 2");

    return {
      pathName: "section",
      title: "section",
      pageIndex: firstIncompleteQuestion!.pageIndex,
      questionIndex: 0,
    };
  }
  // console.log("getFirstLocationWithDeviation 3");

  const location: ILocation = {
    pathName: "section",
    title: "section",
    pageIndex: Math.min(
      resultCheckingRules.deviationPageIndex,
      firstIncompleteQuestion!.pageIndex
    ),
    questionIndex: 0,
  };
  return location;
};
