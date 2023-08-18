import { AxiosError } from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { IAnswer, IBackendAnswer, IData } from "../../types";
import { fakeData } from "../../utils/fakeData";
import { fakeData2 } from "../../utils/fakeData2";
import { userAnswerParses } from "../../utils/userAnswerParser";
import { complete, fethData, sendData } from "../api";
import { PATH_NAME, DEFAULT_SURVEY_ID } from "../api/const";
import {
  changeCurretLocation,
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
  answers: IBackendAnswer[];
  [key: string]: unknown;
};

export type IStartResult = {
  data: string;
  [key: string]: unknown;
};

export type IStoredData = {
  uid: string;
  surveyID: string;
};

function* fetchSurveyData() {
  const params = new URLSearchParams(document.location.search);
  const surveyIDfromURL = params.get("surveyID");
  const surveyID = surveyIDfromURL ? surveyIDfromURL : DEFAULT_SURVEY_ID;

  const storedData = localStorage.getItem("surveyParams");
  const surveyParams: IStoredData | null = storedData && JSON.parse(storedData);
  const prevUid = surveyParams ? surveyParams.uid : "";
  const prevSurveyID = surveyParams ? surveyParams.surveyID : "";
  const isRetryingFetch = String(prevSurveyID) === String(surveyID);

  const uid = isRetryingFetch ? `?uid=${prevUid}` : "";
  const path = PATH_NAME + surveyID + uid;

  try {
    yield put(setLoading(true));
    const result: IFetchResult = yield call(() => fethData(path));
    // console.log("result", result);
    yield put(setNewData(result.data));
    if (isRetryingFetch) {
      yield put(setSurveyUid(prevUid));
    }
    // yield put(setNewData(fakeData));
    // yield put(
    //   changeCurretLocation({
    //     location: {
    //       pageIndex: 0,
    //       pathName: "section",
    //       questionIndex: 0,
    //       title: "section",
    //     },
    //     slideMoveDirection: "right-to-left",
    //   })
    // );

    yield put(setLoading(false));
  } catch (e) {
    console.log("Error fetchSurveyData");
    yield put(setLoading(false));
    const error = e as AxiosError;
    yield put(setError({ status: true, message: error.message }));
  }
}

// console.log("surveyParams", surveyParams);
// console.log("prevSurveyID", prevSurveyID);
// console.log("surveyID", surveyID);
// console.log("isRetryingFetch", isRetryingFetch);
// const path = PATH_NAME + surveyID;
// console.log("document.location", document.location);
// console.log(params);
// console.log(surveyIDfromURL);
// const path = PATH_NAME + surveyID + "?uid=0a663acfd56a4379a9041cf9f3ccdb50";
// 3d16cb65adce4bb49a0e9400d04543a9
// console.log("fetchSurveyData path", path);
// const paramsObj: { [key: string]: any } = {};
// for (const [key, value] of params) {
// 	paramsObj[String(key)] = value;
// }

function* startSurvey() {
  const { surveyID } = yield select(selectSurveyID);
  const path = PATH_NAME + "start/" + surveyID;
  console.log("startSurvey");

  try {
    yield put(setLoading(true));
    const result: IStartResult = yield call(() => fethData(path));
    yield put(setSurveyUid(result.data));
    localStorage.setItem(
      "surveyParams",
      JSON.stringify({ uid: result.data, surveyID: surveyID })
    );
    yield put(setLoading(false));
    console.log("startSurvey success", result);
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
    yield put(setLoading(true));
    const result: unknown = yield call(() => sendData(path, answers));
    yield put(setLoading(false));
    console.log("sendSurveyData success", result);
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

    // console.log("completeSurvey send success", result1);
    // console.log("completeSurvey complete success", result2);
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
