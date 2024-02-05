import { takeEvery } from "redux-saga/effects";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SAGA_CHANGE_LOCATION,
  SEND_SURVEY_DATA,
  SET_USER_ANSWER,
  START_SURVEY,
} from "../redux/types";
import {
  fetchSurveyData,
  sendSurveyData,
  startSurvey,
} from "./api_saga_functions";
import { completeSurvey, sagaChangeLocation, setAnswer } from "./saga";

function* mySaga() {
  yield takeEvery(FETCH_SURVEY_DATA, fetchSurveyData);
  yield takeEvery(START_SURVEY, startSurvey);
  yield takeEvery(SEND_SURVEY_DATA, sendSurveyData);
  yield takeEvery(COMPLETE_SURVEY, completeSurvey);
  yield takeEvery(SAGA_CHANGE_LOCATION, sagaChangeLocation);
  yield takeEvery(SET_USER_ANSWER, setAnswer);
}

export default mySaga;
