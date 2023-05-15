import { createSelector } from "reselect";
import { IState } from "../../types";

export const selectSurveyID = (state: IState) => ({
  surveyID: state.data!.docID,
});

export const selectUid = (state: IState) => ({
  uid: state.params.uid,
});

export const selectAnswers = (state: IState) => ({
  userAnswers: state.userAnswers,
});
