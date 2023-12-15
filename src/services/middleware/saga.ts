import { AxiosError } from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  IBackendAnswer,
  IData,
  IDependentsQuestionsLogicalValidity,
  IDisqualificationRule,
  ILocation,
  ILogicalValidityCheckRuleDict,
  IModalMessage,
  IPage,
  IResultCheckingRules,
  ISlideMoveDirection,
  ISurveyCompletionRule,
  IUserAnswer,
} from "../../types";
import getCheckingConfig from "../../utils/getCheckingConfig";
import { getFirstLocationWithDeviation } from "../../utils/getFirstLocationWithDeviation";
import logicalRulesChecking from "../../utils/logicalvalidityChecking";
import pageQuestionChecking from "../../utils/pageQuestionChecking";
// import { fakeData } from "../../utils/fakeData";
// import { fakeData2 } from "../../utils/fakeData2";
import {
  findFirstIncompleteQuestion,
  requiredQuestionsChecking,
} from "../../utils/questionIsDone";
import {
  disqualificationRuleChecking,
  logicalValidityChecking,
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
  updateLogicalRyleStatus,
  setFirstLocationWithDeviation,
  setAllPagesVisited,
  cancelCompletion,
} from "../redux/actions";
import {
  allLogicalRulesCheckingProps,
  logicalRulesCheckingProps,
  selectAnswers,
  selectAnswersAndUid,
  selectChangePageProps,
  selectCompleteSurveyProps,
  selectLogicValidityData,
  selectSurveyID,
  selectUid,
} from "../redux/selectors";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SAGA_CHANGE_CURRENT_PAGE,
  SAGA_CHANGE_LOCATION,
  SEND_ANSWERS,
  SEND_SURVEY_DATA,
  SET_USER_ANSWER,
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
    const { isShowGreetingsPage } = data;
    const needEmediatlyStartSurvey = !isShowGreetingsPage && !notTheFirstTime;

    yield put(setLoading(false));
    if (needEmediatlyStartSurvey) {
      yield put({ type: START_SURVEY, isContinue: false });
    }
  } catch (e) {
    console.log("Error fetchSurveyData");
    console.log("Error fetchSurveyData", e);

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

  try {
    yield put(setLoading(true));
    yield call(() => sendData(path, answers));
    yield put(setLoading(false));
    // console.log("sendSurveyData success", result);
  } catch (err) {
    console.log("error", err);
  }
}

function* checkCurrentPageLogicalValidity(logicalChecking: boolean) {
  if (!logicalChecking) {
    return true;
  }

  const {
    dependentPagesDict,
    logicalValidityCheckRuleDict,
    userAnswers,
    pageDocID,
  } = yield select(logicalRulesCheckingProps);

  const logicCheckingResult = logicalRulesChecking({
    dependentPagesDict,
    logicalValidityCheckRuleDict,
    userAnswers,
    pageDocID,
    logicalChecking,
  });

  if (!logicCheckingResult.status) {
    yield put(
      updateLogicalRyleStatus({
        values: logicCheckingResult.newLogicalValidityRuleValues,
      })
    );
    return false;
  }

  return true;
}

function* checkAllPagesLogicalValidity() {
  const {
    dependentPagesDict,
    logicalValidityCheckRuleDict,
    userAnswers,
    pages,
  } = yield select(allLogicalRulesCheckingProps);
  let findPageWithUnvalidRule = false;
  let deviationPageIndex = 0;

  const newLogicalValidityRuleValues = pages.reduce(
    (res: ILogicalValidityCheckRuleDict, page: IPage, index: number) => {
      const logicCheckingResult = logicalRulesChecking({
        dependentPagesDict,
        logicalValidityCheckRuleDict,
        userAnswers,
        pageDocID: page.docID,
        logicalChecking: true,
      });
      if (!logicCheckingResult.status && !findPageWithUnvalidRule) {
        findPageWithUnvalidRule = true;
        deviationPageIndex = index;
      }

      return { ...res, ...logicCheckingResult.newLogicalValidityRuleValues };
    },
    {} as ILogicalValidityCheckRuleDict
  );

  yield put(
    updateLogicalRyleStatus({
      values: newLogicalValidityRuleValues,
    })
  );

  return { status: !findPageWithUnvalidRule, deviationPageIndex };
}

function* completeValidation() {
  const {
    userAnswers,
    pages,
    surveyCompletionRuleArr,
    disqualificationRuleArr,
    strictModeNavigation,
  } = yield select(selectChangePageProps);

  if (strictModeNavigation) {
    const result: boolean = yield call(() =>
      changeLocationValidation("right-to-left")
    );
    return result;
  }

  const isDisqualificated = disqualificationRuleArr.some(
    (rule: IDisqualificationRule) =>
      disqualificationRuleChecking(userAnswers, rule)
  );
  if (isDisqualificated) {
    yield imediateDisqualification();
    return false;
  }

  const isComplete = surveyCompletionRuleArr.some(
    (rule: ISurveyCompletionRule) => surveyCompletionChecking(userAnswers, rule)
  );

  if (isComplete) {
    yield imediateCompletion();
    return false;
  }

  const firstIncompleteQuestion = findFirstIncompleteQuestion(
    pages,
    userAnswers
  );
  const resultCheckingRules: IResultCheckingRules = yield call(() =>
    checkAllPagesLogicalValidity()
  );

  console.log("resultCheckingRules", resultCheckingRules);

  if (!firstIncompleteQuestion && resultCheckingRules.status) {
    console.log("all questions and rules are correct");
    return true;
  }

  const firstLocationWithDeviation = getFirstLocationWithDeviation(
    firstIncompleteQuestion,
    resultCheckingRules
  );

  yield put(
    cancelCompletion({
      location: firstLocationWithDeviation,
      modalMessage: { code: 302, type: "completion" },
    })
  );

  // yield put(
  //   setFirstLocationWithDeviation({ location: firstLocationWithDeviation })
  // );
  // yield put(setAllPagesVisited());

  // найти первую стр с отклонением
  console.log("2");

  return !firstIncompleteQuestion && resultCheckingRules.status;
}

function* completeSurvey() {
  // проверить все/все посещенные страницы. зависит от strictModeNavigation

  // проверка
  const completeValidationResult: boolean = yield call(() =>
    completeValidation()
  );

  if (completeValidationResult) {
    yield imediateCompletion();
  }
}

function* sendAnswers() {
  const { uid, userAnswers } = yield select(selectAnswersAndUid);
  const answers = userAnswerParses(userAnswers);
  const path = PATH_NAME + "answers/?uid=" + uid;
  try {
    yield put(setLoading(true));
    yield call(() => sendData(path, answers));
    yield put(setLoading(false));
  } catch (err) {
    console.log("error", err);
  }
}

function* setAnswer(payload: {
  type: typeof SET_USER_ANSWER;
  payload: { questionID: number };
}) {
  const questionID = payload.payload.questionID;
  const {
    logicalValidityCheckRuleDict,
    dependentQuestionsDict,
    userAnswers,
  }: {
    logicalValidityCheckRuleDict: ILogicalValidityCheckRuleDict;
    dependentQuestionsDict: IDependentsQuestionsLogicalValidity;
    userAnswers: IUserAnswer;
  } = yield select(selectLogicValidityData);

  const dependentRulsID = dependentQuestionsDict[questionID];

  if (!dependentRulsID) return;

  const result: ILogicalValidityCheckRuleDict = {};
  dependentRulsID.forEach((id) => {
    const logicRule = logicalValidityCheckRuleDict[id].logicRule;
    const newStatus = logicalValidityChecking(userAnswers, logicRule);
    result[String(id)] = {
      logicRule: logicRule,
      status: newStatus,
    };
  });

  yield put(updateLogicalRyleStatus({ values: result }));
}

function* changeLocationValidation(direction: ISlideMoveDirection) {
  const {
    userAnswers,
    location,
    pages,
    surveyCompletionRuleArr,
    disqualificationRuleArr,
    dependentPagesDict,
    logicalValidityCheckRuleDict,
    strictModeNavigation,
  } = yield select(selectChangePageProps);

  const currentPage = pages[location.pageIndex];
  const {
    questionChecking,
    logicalChecking,
    disqualificationChecking,
    completeChecking,
  } = getCheckingConfig(direction, strictModeNavigation);

  try {
    // проверка на дисквалификацию
    const isDisqualificated = disqualificationChecking
      ? disqualificationRuleArr.some((rule: IDisqualificationRule) =>
          disqualificationRuleChecking(userAnswers, rule)
        )
      : false;

    if (isDisqualificated) {
      throw { code: 401, type: "disqualification" };
    }

    // проверка на досрочное завершение
    const isComplete = completeChecking
      ? surveyCompletionRuleArr.some((rule: ISurveyCompletionRule) =>
          surveyCompletionChecking(userAnswers, rule)
        )
      : false;
    if (isComplete) {
      throw { code: 301, type: "completion" };
    }

    // валидация обязательных вопросов
    const questionCheckingResult = pageQuestionChecking({
      page: currentPage,
      userAnswers,
      questionChecking,
    });

    if (!questionCheckingResult.status) {
      throw questionCheckingResult.modalMessage;
    }

    // валидация логической коррекции
    const logicCheckingResult: boolean = yield call(() =>
      checkCurrentPageLogicalValidity(logicalChecking)
    );

    if (!logicCheckingResult) {
      throw {
        code: 202,
        type: "cancelTransition",
      };
    }
  } catch (mm) {
    console.log("catch", mm);
    const modalMessage = mm as IModalMessage;
    switch (modalMessage.code) {
      case 201:
      case 202: {
        yield put(
          cancelTransition({
            currentPageDocID: String(currentPage.docID),
            modalMessage: modalMessage as IModalMessage,
          })
        );
        return false;
      }

      case 301: {
        yield imediateCompletion();
        return false;
      }

      case 401: {
        yield imediateDisqualification();
        return false;
      }
    }
  }

  return true;
}

function* sagaChangeLocation({
  targetPageID,
  direction,
}: {
  type: typeof SAGA_CHANGE_LOCATION;
  direction: ISlideMoveDirection;
  targetPageID?: string;
}) {
  console.log("sagaChangeLocation");
  const validationResult: boolean = yield call(() =>
    changeLocationValidation(direction)
  );

  if (!validationResult) {
    return;
  }

  yield sagaSendData();
  // const res: boolean = yield call(() => sagaSendData());
  if (direction === "left-to-right") {
    yield put(goToThePrevPage({ direction, targetPageID: targetPageID }));
  } else {
    yield put(goToTheNextPage({ direction, targetPageID: targetPageID }));
  }
}

function* sagaSendData() {
  console.log("sagaSendData");
  const { uid, userAnswers } = yield select(selectChangePageProps);

  const answers = userAnswerParses(userAnswers);
  const path = PATH_NAME + "answers/?uid=" + uid;
  try {
    yield put(setLoading(true));
    yield call(() => sendData(path, answers));
    yield put(setLoading(false));
    // console.log("sendSurveyData success", result);
  } catch (err) {
    console.log("error", err);
  }
}

function* imediateCompletion() {
  console.log("imediateCompletion");
  const { uid, userAnswers, location } = yield select(
    selectCompleteSurveyProps
  );

  const answers = userAnswerParses(userAnswers);
  const pathSendData = PATH_NAME + "answers/?uid=" + uid;
  const pathComplete = PATH_NAME + "complete/" + uid;

  try {
    yield put(setLoading(true));
    yield call(() => sendData(pathSendData, answers));
    yield call(() => complete(pathComplete, {}));
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
    // clear localStorage
    localStorage.clear();
    yield put(setLoading(false));
  } catch (err) {
    console.log("error", err);
  }
}

function* imediateDisqualification() {
  console.log("imediateDisqualification");
  const { uid, userAnswers, location } = yield select(
    selectCompleteSurveyProps
  );

  const answers = userAnswerParses(userAnswers);
  const pathSendData = PATH_NAME + "answers/?uid=" + uid;
  const pathComplete = PATH_NAME + "complete/" + uid;

  try {
    yield put(setLoading(true));
    yield call(() => sendData(pathSendData, answers));
    yield call(() => complete(pathComplete, {}));
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
    localStorage.clear();

    yield put(setLoading(false));
  } catch (err) {
    console.log("error", err);
  }
}

function* mySaga() {
  yield takeEvery(FETCH_SURVEY_DATA, fetchSurveyData);
  yield takeEvery(START_SURVEY, startSurvey);
  yield takeEvery(SEND_SURVEY_DATA, sendSurveyData);
  yield takeEvery(COMPLETE_SURVEY, completeSurvey);
  yield takeEvery(SAGA_CHANGE_LOCATION, sagaChangeLocation);
  yield takeEvery(SET_USER_ANSWER, setAnswer);
  yield takeEvery(SEND_ANSWERS, sendAnswers);
}

export default mySaga;
