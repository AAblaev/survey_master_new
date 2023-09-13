import { IPage, IPageTransitionRule, IUserAnswer } from "../types";
import { pageTransitionRuleChecking } from "./rule-utils";

type IGetNextPageDocID = (payload: {
  curentPage: { page: IPage; order: number };
  pages: IPage[];
  pageTransitionRules?: IPageTransitionRule[];
  userAnswers: IUserAnswer;
}) => string;

export const getNextPageDocID: IGetNextPageDocID = ({
  curentPage,
  pages,
  pageTransitionRules,
  userAnswers,
}) => {
  const { order, page } = curentPage;

  if (!pageTransitionRules && order + 1 === pages.length) {
    return "surveyCopletion";
  }

  if (!pageTransitionRules) {
    return String(pages[order + 1].docID);
  }

  const firstExecutedRule = pageTransitionRules.find((rule) =>
    pageTransitionRuleChecking(userAnswers, rule)
  );

  return firstExecutedRule
    ? String(firstExecutedRule.targetPageID)
    : String(pages[order + 1].docID);
};
