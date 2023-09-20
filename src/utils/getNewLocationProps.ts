import {
  ILocation,
  IPage,
  IPagesDict,
  IPageTransitionRuleDict,
  ISlideMoveDirection,
  ISurveyCompletionRule,
  IUserAnswer,
} from "../types";
import { sectionValidtion } from "./questionIsDone";
import { getNextLocation, surveyCompletionChecking } from "./rule-utils";

type IGetNewLocationProps = (payload: {
  location: ILocation;
  visitedPageDocIDList: string[];
  pageMovementLogs: string[];
  targetPageTransitionRuleArr: string[];
  userAnswers: IUserAnswer;
  pages: IPage[];
  pagesDict: IPagesDict;
  pageTransitionRuleDict: IPageTransitionRuleDict;
  slideMoveDirection: ISlideMoveDirection;
}) => {
  location: ILocation;
  visitedPageDocIDList: string[];
  pageMovementLogs: string[];
};

export const getNewLocationProps: IGetNewLocationProps = ({
  location,
  pageMovementLogs,
  pages,
  pagesDict,
  pageTransitionRuleDict,
  userAnswers,
  visitedPageDocIDList,
  slideMoveDirection,
  targetPageTransitionRuleArr,
}) => {
  // if (
  //   surveyCompletionRuleArr.some((rule) =>
  //     surveyCompletionChecking(userAnswers, rule)
  //   )
  // ) {
  //   return {
  //     location: {
  //       pathName: "completion",
  //       title: "completion",
  //       pageIndex: 0,
  //       questionIndex: 0,
  //     },
  //     pageMovementLogs,
  //     visitedPageDocIDList,
  //   };
  // }

  const { pageIndex } = location;
  const currentPage = pages[pageIndex];
  const currentPageDocID = String(currentPage.docID);
  const newVisitedPageDocIDList = visitedPageDocIDList.includes(
    currentPageDocID
  )
    ? visitedPageDocIDList
    : [...visitedPageDocIDList, currentPageDocID];

  if (slideMoveDirection === "left-to-right") {
    // console.log("pageMovementLogs", pageMovementLogs);
    const prevPageDocID =
      pageMovementLogs[pageMovementLogs.indexOf(currentPageDocID) - 1];
    const prevLocation = {
      ...location,
      pageIndex: pagesDict[prevPageDocID].order,
    };
    const newPageMovementLogs = pageMovementLogs.filter(
      (_v, i, arr) => i !== arr.length - 1
    );
    return {
      location: prevLocation,
      pageMovementLogs: newPageMovementLogs,
      visitedPageDocIDList: newVisitedPageDocIDList,
    };
  }

  const resultSectionValidation = sectionValidtion(currentPage, userAnswers);

  if (resultSectionValidation) {
    const nextLocation = getNextLocation({
      currentLocation: location,
      pageCount: pages.length,
      pageTransitionRules: pageTransitionRuleDict[currentPageDocID],
      userAnswers,
      pagesDict,
      pageMovementLogs,
      pages,
      targetPageTransitionRuleArr,
    });

    const newPageMovementLogs =
      nextLocation.pathName === "completion"
        ? pageMovementLogs
        : [...pageMovementLogs, String(pages[nextLocation.pageIndex].docID)];

    return {
      location: nextLocation,
      pageMovementLogs: newPageMovementLogs,
      visitedPageDocIDList,
    };
  }

  return {
    location: location,
    pageMovementLogs,
    visitedPageDocIDList: newVisitedPageDocIDList,
  };
};
