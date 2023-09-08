import { AxiosError } from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { IAnswer, IBackendAnswer, IData } from "../../types";
import { fakeData } from "../../utils/fakeData";
import { fakeData2 } from "../../utils/fakeData2";
import { userAnswerParses } from "../../utils/userAnswerParser";
import { complete, fethData, sendData } from "../api";
import {
  PATH_NAME,
  PATH_NAME_II,
  DEFAULT_SURVEY_ID,
  getPathName,
} from "../api/const";
import {
  setError,
  setLoading,
  setNewData,
  setPath,
  setSurveyID,
  setSurveyUid,
} from "../redux/actions";
import {
  selectAnswers,
  selectPathName,
  selectSurveyID,
  selectUid,
} from "../redux/selectors";
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
  const uidFromURL = params.get("uid");

  // console.log("typeof(surveyIDfromURL)", typeof surveyIDfromURL);
  // console.log("isNaN", Number.isNaN(Number(surveyIDfromURL)));

  const isNewAPI = Number.isNaN(Number(surveyIDfromURL));

  const surveyID = surveyIDfromURL ? surveyIDfromURL : DEFAULT_SURVEY_ID;
  // console.log("surveyID", surveyID);

  const storedData = localStorage.getItem("surveyParams");
  const surveyParams: IStoredData | null = storedData && JSON.parse(storedData);
  const prevUid = surveyParams ? surveyParams.uid : "";
  const prevSurveyID = surveyParams ? surveyParams.surveyID : "";
  const isRetryingFetch = String(prevSurveyID) === String(surveyID);
  const path = getPathName({
    basePath: isNewAPI ? `${PATH_NAME_II}bylink/` : PATH_NAME,
    surveyIDfromURL,
    uidFromURL,
    prevSurveyID,
    prevUid,
    isNewAPI,
  });
  try {
    yield put(setLoading(true));

    // yield put(setSurveyID(surveyID));
    // yield put(setPath(isNewAPI ? PATH_NAME_II : PATH_NAME));
    // const result: IFetchResult = yield call(() => fethData(path));
    // yield put(setNewData(result.data));
    // if (uidFromURL) {
    //   yield put(setSurveyUid(uidFromURL));
    // } else if (isRetryingFetch) {
    //   yield put(setSurveyUid(prevUid));
    // }

    yield put(setNewData(fakeData));

    yield put(setLoading(false));
  } catch (e) {
    console.log("Error fetchSurveyData");
    yield put(setLoading(false));
    const error = e as AxiosError;
    yield put(setError({ status: true, message: error.message }));
  }
}

function* startSurvey() {
  const { pathName } = yield select(selectPathName);
  const { surveyID } = yield select(selectSurveyID);
  const isNewAPI = Number.isNaN(Number(surveyID));

  // console.log("PATH_NAME_II", PATH_NAME_II);
  // console.log("PATH_NAME", PATH_NAME);
  // console.log("pathName", pathName);
  // console.log("surveyID", surveyID);
  // console.log("isNewAPI", isNewAPI);

  const path = isNewAPI
    ? `${PATH_NAME_II}start2/${surveyID}`
    : `${PATH_NAME}start/${surveyID}`;
  console.log("startSurvey path", path);

  try {
    // yield put(setLoading(true));
    // const result: IStartResult = yield call(() => fethData(path));
    // yield put(setSurveyUid(result.data));
    // localStorage.setItem(
    //   "surveyParams",
    //   JSON.stringify({ uid: result.data, surveyID: surveyID })
    // );
    // yield put(setLoading(false));
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
