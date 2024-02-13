import { call, put, select } from "redux-saga/effects";
import {
  IDependentsQuestionsLogicalValidity,
  IDisqualificationRule,
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
import { findFirstIncompleteQuestion } from "../../utils/questionIsDone";
import {
  disqualificationRuleChecking,
  logicalValidityChecking,
  surveyCompletionChecking,
} from "../../utils/rule-utils";

import {
  goToTheNextPage,
  goToThePrevPage,
  cancelTransition,
  updateLogicalRyleStatus,
  cancelCompletion,
  setCurrentPage,
  toggleModalVoisible,
  toggleTimer,
} from "../redux/actions";
import {
  allLogicalRulesCheckingProps,
  logicalRulesCheckingProps,
  selectChangePageProps,
  selectLogicValidityData,
  selectStartAgainProps,
} from "../redux/selectors";
import {
  SAGA_CHANGE_LOCATION,
  SET_USER_ANSWER,
  START_SURVEY,
} from "../redux/types";
import {
  imediateCompletion,
  imediateDisqualification,
  sagaSendData,
} from "./api_saga_functions";

export function* checkCurrentPageLogicalValidity(logicalChecking: boolean) {
  // console.log("!checkCurrentPageLogicalValidity", logicalChecking);
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
  // console.log("logicCheckingResult", logicCheckingResult);

  if (!logicCheckingResult.status) {
    // console.log("hello");
    yield put(
      updateLogicalRyleStatus({
        values: logicCheckingResult.newLogicalValidityRuleValues,
      })
    );
    return false;
  }

  return true;
}

export function* checkAllPagesLogicalValidity() {
  const {
    dependentPagesDict,
    logicalValidityCheckRuleDict,
    userAnswers,
    pagesDict,
    pageMovementLogs,
  } = yield select(allLogicalRulesCheckingProps);
  let findPageWithUnvalidRule = false;
  let deviationPageIndex = 0;

  // console.log("pageMovementLogs", pageMovementLogs);

  const newLogicalValidityRuleValues = pageMovementLogs.reduce(
    (res: ILogicalValidityCheckRuleDict, docID: IPage["docID"]) => {
      const logicCheckingResult = logicalRulesChecking({
        dependentPagesDict,
        logicalValidityCheckRuleDict,
        userAnswers,
        pageDocID: docID,
        logicalChecking: true,
      });
      if (!logicCheckingResult.status && !findPageWithUnvalidRule) {
        findPageWithUnvalidRule = true;
        deviationPageIndex = docID;
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

  return {
    status: !findPageWithUnvalidRule,
    deviationPageIndex: deviationPageIndex
      ? pagesDict[deviationPageIndex].order
      : deviationPageIndex,
  };
}

export function* completeValidation() {
  const {
    userAnswers,
    pages,
    surveyCompletionRuleArr,
    disqualificationRuleArr,
    pageMovementLogs,
  } = yield select(selectChangePageProps);

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
  // console.log("isComplete", isComplete);

  if (isComplete) {
    yield imediateCompletion();
    return false;
  }
  const firstIncompleteQuestion = findFirstIncompleteQuestion(
    pages.filter((page: IPage) =>
      (pageMovementLogs as number[]).includes(page.docID)
    ) as IPage[],
    userAnswers
  );
  const resultCheckingRules: IResultCheckingRules = yield call(() =>
    checkAllPagesLogicalValidity()
  );

  if (!firstIncompleteQuestion && resultCheckingRules.status) {
    // console.log("all questions and rules are correct");
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

  return !firstIncompleteQuestion && resultCheckingRules.status;
}

export function* completeSurvey() {
  // проверить все/все посещенные страницы. зависит от strictModeNavigation

  // проверка
  const completeValidationResult: boolean = yield call(() =>
    completeValidation()
  );

  if (completeValidationResult) {
    yield imediateCompletion();
  }
}

export function* setAnswer(payload: {
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
  // console.log("asdasd");
  if (!dependentRulsID) return;
  // console.log("asdasd11");

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

export function* changeLocationValidation(direction: ISlideMoveDirection) {
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
    // console.log("catch", mm);
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

export function* sagaChangeLocation({
  targetPageID,
  direction,
}: {
  type: typeof SAGA_CHANGE_LOCATION;
  direction: ISlideMoveDirection;
  targetPageID?: string;
}) {
  // console.log("sagaChangeLocation");
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

export function* completeByTymer() {
  yield put(toggleModalVoisible(false));
  yield imediateCompletion(true);
}

export function* sagaStartAgain() {
  const { isShowGreetingsPage, isShowPageList } = yield select(
    selectStartAgainProps
  );

  if (isShowGreetingsPage) {
    yield put(
      setCurrentPage({
        slideMoveDirection: "left-to-right",
        location: {
          pathName: "greeting",
          title: "greeting",
          pageIndex: 0,
          questionIndex: 0,
        },
        pageMovementLogs: [],
        visitedPageDocIDList: [],
      })
    );
    yield put(toggleModalVoisible(false));
    yield put(toggleTimer(false));
    localStorage.clear();
    return;
  }
  yield put(toggleModalVoisible(false));

  yield put({ type: START_SURVEY, isContinue: false });
}
