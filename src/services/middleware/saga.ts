import { AxiosError } from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  IAnswer,
  IBackendAnswer,
  IData,
  ILocation,
  ISlideMoveDirection,
} from "../../types";
import { fakeData } from "../../utils/fakeData";
import { fakeData2 } from "../../utils/fakeData2";
import { findFirstIncompleteQuestion } from "../../utils/questionIsDone";
import { userAnswerParses } from "../../utils/userAnswerParser";
import { complete, fethData, sendData } from "../api";
import {
  PATH_NAME,
  PATH_NAME_II,
  DEFAULT_SURVEY_ID,
  getPathName,
} from "../api/const";
import {
  changeCurretLocation,
  deleteUserAnswers,
  setError,
  setLoading,
  setNeedScrolling,
  setSurveyUid,
  setDataAndParams,
  continuePrevSurvey,
  startNewSurvey,
  setCurrentPage,
  goToTheNextPage,
  goToThePrevPage,
} from "../redux/actions";
import {
  selectAnswers,
  selectCurrentLocation,
  selectPages,
  selectPathName,
  selectSurveyID,
  selectUid,
  showPageList,
} from "../redux/selectors";
import {
  COMPLETE_SURVEY,
  CONTINUE_PREV_SURVEY,
  FETCH_SURVEY_DATA,
  SAGA_CHANGE_CURRENT_PAGE,
  SEND_SURVEY_DATA,
  START_SURVEY,
} from "../redux/types";
import { getParams } from "./utils";

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
  const { fetchPath, path, uid, surveyID } = getParams();
  const params = {
    surveyID,
    uid,
    path,
  };
  try {
    yield put(setLoading(true));
    const result: IFetchResult = yield call(() => fethData(fetchPath));
    const data = result.data;

    yield put(
      setDataAndParams({
        data,
        params,
      })
    );

    // yield put(setNewData(fakeData));
    yield put(setLoading(false));
  } catch (e) {
    console.log("Error fetchSurveyData");
    yield put(setLoading(false));
    const error = e as AxiosError;
    yield put(setError({ status: true, message: error.message }));
  }
}

function* startSurvey({
  isContinue,
}: {
  type: typeof START_SURVEY;
  isContinue: boolean;
}) {
  const { surveyID } = yield select(selectSurveyID);
  if (isContinue) {
    yield put(continuePrevSurvey());
    return;
  }

  const isNewAPI = Number.isNaN(Number(surveyID));

  const path = isNewAPI
    ? `${PATH_NAME}start2/${surveyID}`
    : `${PATH_NAME}start/${surveyID}`;

  try {
    yield put(setLoading(true));
    const result: IStartResult = yield call(() => fethData(path));
    const newUid = result.data;
    yield put(startNewSurvey(newUid));
    localStorage.setItem(
      "surveyParams",
      JSON.stringify({ uid: newUid, surveyID: surveyID })
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
  console.log("path", path);
  console.log("answers", answers);

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

function* changeCurrentPage({
  direction,
}: {
  type: typeof SAGA_CHANGE_CURRENT_PAGE;
  direction: ISlideMoveDirection;
}) {
  const { uid } = yield select(selectUid);
  const { userAnswers } = yield select(selectAnswers);
  const answers = userAnswerParses(userAnswers);
  const path = PATH_NAME + "answers/?uid=" + uid;

  try {
    yield put(setLoading(true));
    const result: unknown = yield call(() => sendData(path, answers));
    if (direction === "right-to-left") {
      yield put(goToTheNextPage());
    } else {
      yield put(goToThePrevPage());
    }
    yield put(setLoading(false));
    console.log("sendSurveyData success", result);
  } catch (err) {
    console.log("error", err);
  }

  // const { location,pageMovementLogs } = yield select(selectCurrentLocation);
  // const {pages} = yield select(selectPages)
  // const currentPage = pages[location.pageIndex]

  // отправить на сервер+

  // сохранить в visitedPageDocIDList+
  // влево? ->  перейти и обновить pageMovementLogs

  // вправо? -> провести валидацию страницы
  // да? - перейти и обновить pageMovementLogs

  // pageMovementLogs

  console.log("direction", location);
}

function* mySaga() {
  yield takeEvery(FETCH_SURVEY_DATA, fetchSurveyData);
  yield takeEvery(START_SURVEY, startSurvey);
  yield takeEvery(SEND_SURVEY_DATA, sendSurveyData);
  yield takeEvery(COMPLETE_SURVEY, completeSurvey);
  yield takeEvery(SAGA_CHANGE_CURRENT_PAGE, changeCurrentPage);
}

export default mySaga;
