import { takeEvery } from "redux-saga/effects";
import {
  COMPLETE_SURVEY,
  COMPLETE_SURVEY_BY_TIMER,
  FETCH_SURVEY_DATA,
  SAGA_CHANGE_LOCATION,
  SAGA_START_AGAIN,
  SEND_SURVEY_DATA,
  SET_USER_ANSWER,
  START_SURVEY,
} from "../redux/types";
import {
  fetchSurveyData,
  sendSurveyData,
  startSurvey,
} from "./api_saga_functions";
import {
  completeByTymer,
  completeSurvey,
  sagaChangeLocation,
  sagaStartAgain,
  setAnswer,
} from "./saga";

function* mySaga() {
  yield takeEvery(FETCH_SURVEY_DATA, fetchSurveyData);
  yield takeEvery(START_SURVEY, startSurvey);
  yield takeEvery(SEND_SURVEY_DATA, sendSurveyData);
  yield takeEvery(COMPLETE_SURVEY, completeSurvey);
  yield takeEvery(SAGA_CHANGE_LOCATION, sagaChangeLocation);
  yield takeEvery(SET_USER_ANSWER, setAnswer);
  yield takeEvery(COMPLETE_SURVEY_BY_TIMER, completeByTymer);
  yield takeEvery(SAGA_START_AGAIN, sagaStartAgain);
}

export default mySaga;
