import { AxiosError } from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { IData } from "../../types";
import { fakeData } from "../../utils/fakeData";
import { userAnswerParses } from "../../utils/userAnswerParser";
import { complete, fethData, sendData } from "../api";
import { PATH_NAME, DEFAULT_SURVEY_ID } from "../api/const";
import {
  setError,
  setLoading,
  setNewData,
  setSurveyUid,
} from "../redux/actions";
import { selectAnswers, selectSurveyID, selectUid } from "../redux/selectors";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  START_SURVEY,
} from "../redux/types";

export type IFetchResult = {
  data: IData;
  [key: string]: unknown;
};

export type IStartResult = {
  data: string;
  [key: string]: unknown;
};

function* fetchSurveyData() {
  const params = new URLSearchParams(document.location.search);
  const surveyIDfromURL = params.get("surveyID");
  const surveyID = surveyIDfromURL ? surveyIDfromURL : DEFAULT_SURVEY_ID;
  const path = PATH_NAME + surveyID;

  // console.log("fetchSurveyData path", path);
  // const paramsObj: { [key: string]: any } = {};
  // for (const [key, value] of params) {
  // 	paramsObj[String(key)] = value;
  // }

  try {
    yield put(setLoading(true));
    const result: IFetchResult = yield call(() => fethData(path));
    yield put(setNewData(result.data));
    // yield put(setNewData(fakeData));

    yield put(setLoading(false));
  } catch (e) {
    console.log("Error fetchSurveyData");
    yield put(setLoading(false));
    const error = e as AxiosError;
    yield put(setError({ status: true, message: error.message }));
  }
}

function* startSurvey() {
  const { surveyID } = yield select(selectSurveyID);
  const path = PATH_NAME + "start/" + surveyID;
  try {
    yield put(setLoading(true));
    const result: IStartResult = yield call(() => fethData(path));
    yield put(setSurveyUid(result.data));
    yield put(setLoading(false));
    // console.log("startSurvey success", result);
  } catch (err) {
    console.log("error", err);
  }
}

function* sendSurveyData() {
  const { uid } = yield select(selectUid);
  const { userAnswers } = yield select(selectAnswers);
  const answers = userAnswerParses(userAnswers);
  const path = PATH_NAME + "answers/?uid=" + uid;

  try {
    // yield put(setLoading(true));
    // const result: unknown = yield call(() => sendData(path, answers));
    // yield put(setLoading(false));
    //
    // console.log("sendSurveyData success", result);
  } catch (err) {
    console.log("error", err);
  }
}

function* completeSurvey() {
  const { uid } = yield select(selectUid);
  const { userAnswers } = yield select(selectAnswers);
  const answers = userAnswerParses(userAnswers);
  const pathSendData = PATH_NAME + "answers/?uid=" + uid;
  const pathComplete = PATH_NAME + "complete/" + uid;

  try {
    yield put(setLoading(true));
    const result1: unknown = yield call(() => sendData(pathSendData, answers));
    const result2: unknown = yield call(() => complete(pathComplete, {}));

    yield put(setLoading(false));

    console.log("completeSurvey send success", result1);
    console.log("completeSurvey complete success", result2);
  } catch (err) {
    console.log("error", err);
  }
}

function* mySaga() {
  yield takeEvery(FETCH_SURVEY_DATA, fetchSurveyData);
  yield takeEvery(START_SURVEY, startSurvey);
  yield takeEvery(SEND_SURVEY_DATA, sendSurveyData);
  yield takeEvery(COMPLETE_SURVEY, completeSurvey);
}

export default mySaga;
