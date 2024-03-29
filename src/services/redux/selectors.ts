import {
  IDependentsQuestionsLogicalValidity,
  ILogicalValidityCheckRuleDict,
  IState,
  IUserAnswer,
} from "../../types";

export const selectSurveyID = (state: IState) => ({
  surveyID: state.params.surveyID,
});

export const selectUid = (state: IState) => ({
  uid: state.params.uid,
});

export const selectPathName = (state: IState) => ({
  pathName: state.params.path,
});

export const selectAnswers = (state: IState) => ({
  userAnswers: state.userAnswers,
});

export const selectAnswersAndUid = (state: IState) => ({
  userAnswers: state.userAnswers,
});

export const selectPages = (state: IState) => ({
  pages: state.data!.pages,
});

export const selectCurrentLocation = (state: IState) => ({
  location: state.location,
  pageMovementLogs: state.pageMovementLogs,
});

export const showPageList = (state: IState) => ({
  isShowPageList: state.data?.isShowPageList,
});

export const selectChangePageProps = (state: IState) => ({
  uid: state.params.uid,
  userAnswers: state.userAnswers,
  location: state.location,
  pages: state.data!.pages,
  surveyCompletionRuleArr: state.surveyCompletionRuleArr,
  disqualificationRuleArr: state.disqualificationRuleArr,
  dependentPagesDict: state.dependentPagesDict,
  logicalValidityCheckRuleDict: state.logicalValidityCheckRuleDict,
  strictModeNavigation: state.strictModeNavigation,
  pageMovementLogs: state.pageMovementLogs,
});

export const selectCompleteSurveyProps = (state: IState) => ({
  uid: state.params.uid,
  userAnswers: state.userAnswers,
  location: state.location,
  pages: state.data!.pages,
  pageMovementLogs: state.pageMovementLogs,
  pagesDict: state.pagesDict,
  strictModeNavigation: state.strictModeNavigation,
});

export const logicalRulesCheckingProps = (state: IState) => {
  const currentPage = state.data?.pages[state.location.pageIndex];
  return {
    logicalValidityCheckRuleDict: state.logicalValidityCheckRuleDict,
    dependentQuestionsDict: state.dependentQuestionsDict,
    dependentPagesDict: state.dependentPagesDict,
    userAnswers: state.userAnswers,
    pageMovementLogs: state.pageMovementLogs,
    pageDocID: currentPage?.docID,
  };
};

export const allLogicalRulesCheckingProps = (state: IState) => {
  return {
    logicalValidityCheckRuleDict: state.logicalValidityCheckRuleDict,
    dependentPagesDict: state.dependentPagesDict,
    userAnswers: state.userAnswers,
    pageMovementLogs: state.pageMovementLogs,
    pagesDict: state.pagesDict,
    pages: state.data!.pages,
  };
};

export const selectLogicValidityData = (
  state: IState
): {
  logicalValidityCheckRuleDict: ILogicalValidityCheckRuleDict;
  dependentQuestionsDict: IDependentsQuestionsLogicalValidity;
  userAnswers: IUserAnswer;
} => ({
  logicalValidityCheckRuleDict: state.logicalValidityCheckRuleDict,
  dependentQuestionsDict: state.dependentQuestionsDict,
  userAnswers: state.userAnswers,
});

export const getBrandColor = (state: IState) => ({
  brandColor: state.styles.globalStyle.brandColor,
});

export const getProgressBarStyle = (state: IState) => ({
  progressBarStyle: state.styles.componentsStyle.progressBar,
});

export const selectStartAgainProps = (state: IState) => ({
  isShowGreetingsPage: state.data!.isShowGreetingsPage,
  isShowPageList: state.data!.isShowPageList,
});
