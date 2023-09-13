import { createSelector } from "reselect";
import { IState } from "../../types";

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
