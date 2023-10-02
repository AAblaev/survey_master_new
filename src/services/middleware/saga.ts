import { AxiosError } from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  IAnswer,
  IBackendAnswer,
  IData,
  IDisqualificationRule,
  ILocation,
  ISlideMoveDirection,
  ISurveyCompletionRule,
} from "../../types";
import { fakeData } from "../../utils/fakeData";
import { fakeData2 } from "../../utils/fakeData2";
import { requiredQuestionsChecking } from "../../utils/questionIsDone";
import {
  disqualificationRuleChecking,
  surveyCompletionChecking,
} from "../../utils/rule-utils";
import { userAnswerParses } from "../../utils/userAnswerParser";
import { complete, fethData, sendData } from "../api";
import { PATH_NAME } from "../api/const";
import {
  changeCurretLocation,
  setError,
  setLoading,
  setDataAndParams,
  continuePrevSurvey,
  startNewSurvey,
  goToTheNextPage,
  goToThePrevPage,
  setVisitedPageDocID,
  cancelTransition,
  surveyCompletionRuleActive,
} from "../redux/actions";
import {
  selectAnswers,
  selectChangePageProps,
  selectCompleteSurveyProps,
  selectSurveyID,
  selectUid,
} from "../redux/selectors";
import {
  COMPLETE_SURVEY,
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
  const { fetchPath, path, uid, surveyID, notTheFirstTime } = getParams();
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
        notTheFirstTime,
      })
    );

    const { isShowGreetingsPage, isShowPageList } = data;

    const needEmediatlyStartSurvey =
      !isShowGreetingsPage && !isShowPageList && !notTheFirstTime;

    yield put(setLoading(false));
    if (needEmediatlyStartSurvey) {
      yield put({ type: START_SURVEY, isContinue: false });
    }
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
  // console.log("path", path);
  // console.log("answers", answers);

  try {
    yield put(setLoading(true));
    const result: unknown = yield call(() => sendData(path, answers));
    yield put(setLoading(false));
    // console.log("sendSurveyData success", result);
  } catch (err) {
    console.log("error", err);
  }
}

function* completeSurvey() {
  const { uid, userAnswers, location, pages } = yield select(
    selectCompleteSurveyProps
  );

  const answers = userAnswerParses(userAnswers);
  const pathSendData = PATH_NAME + "answers/?uid=" + uid;
  const pathComplete = PATH_NAME + "complete/" + uid;

  try {
    yield put(setLoading(true));
    const result1: unknown = yield call(() => sendData(pathSendData, answers));
    const result2: unknown = yield call(() => complete(pathComplete, {}));

    yield put(
      changeCurretLocation({
        location: {
          pathName: "completion",
          title: "completion",
          questionIndex: 0,
          pageIndex: location.pageIndex,
        },
        slideMoveDirection: "right-to-left",
      })
    );

    yield put(setLoading(false));

    // console.log("completeSurvey send success", result1);
    // console.log("completeSurvey complete success", result2);
  } catch (err) {
    console.log("error", err);
  }
}

function* changeCurrentPage({
  direction,
  targetPageID,
}: {
  type: typeof SAGA_CHANGE_CURRENT_PAGE;
  direction: ISlideMoveDirection;
  targetPageID?: string;
}) {
  // если пользователь решил перейти на однц из предыдущих страниц
  // проверки на дисквалификацию и завершение, а так же валидация ответов не вызываются

  const {
    uid,
    userAnswers,
    location,
    pages,
    surveyCompletionRuleArr,
    disqualificationRuleArr,
  } = yield select(selectChangePageProps);

  const answers = userAnswerParses(userAnswers);
  const path = PATH_NAME + "answers/?uid=" + uid;
  if (direction === "left-to-right") {
    try {
      yield put(setLoading(true));
      const result: unknown = yield call(() => sendData(path, answers));
      yield put(setLoading(false));
      // console.log("sendSurveyData success", result);
    } catch (err) {
      console.log("error", err);
    }

    yield put(goToThePrevPage({ direction, targetPageID }));
    return;
  }

  const currentPage = pages[location.pageIndex];

  // валидация страницы
  const pageValidationResult = !requiredQuestionsChecking(
    currentPage,
    userAnswers
  );

  if (!pageValidationResult) {
    yield put(
      cancelTransition({ currentPageDocID: String(currentPage.docID) })
    );
    return;
  }

  // проверка на дисквалификацию
  const isDisqualificated = disqualificationRuleArr.some(
    (rule: IDisqualificationRule) =>
      disqualificationRuleChecking(userAnswers, rule)
  );
  if (isDisqualificated) {
    yield put(setVisitedPageDocID(String(currentPage.docID)));
    yield put(
      changeCurretLocation({
        location: {
          pathName: "disqualification",
          title: "disqualification",
          questionIndex: 0,
          pageIndex: location.pageIndex,
        },
        slideMoveDirection: "right-to-left",
      })
    );
  }

  // проверка на complete rule
  const isComplete = surveyCompletionRuleArr.some(
    (rule: ISurveyCompletionRule) => surveyCompletionChecking(userAnswers, rule)
  );
  if (isComplete) {
    yield put(
      surveyCompletionRuleActive({
        currentPageDocID: String(currentPage.docID),
      })
    );
  }

  // отправить ответы
  // const answers = userAnswerParses(userAnswers);
  // const path = PATH_NAME + "answers/?uid=" + uid;

  try {
    yield put(setLoading(true));
    const result: unknown = yield call(() => sendData(path, answers));
    yield put(setLoading(false));
  } catch (err) {
    console.log("error", err);
  }

  if (isComplete || isDisqualificated) {
    return;
  }

  yield put(goToTheNextPage({ direction, targetPageID }));
}

function* mySaga() {
  yield takeEvery(FETCH_SURVEY_DATA, fetchSurveyData);
  yield takeEvery(START_SURVEY, startSurvey);
  yield takeEvery(SEND_SURVEY_DATA, sendSurveyData);
  yield takeEvery(COMPLETE_SURVEY, completeSurvey);
  yield takeEvery(SAGA_CHANGE_CURRENT_PAGE, changeCurrentPage);
}

export default mySaga;
