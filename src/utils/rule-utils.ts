import { EXTRA_ANSWER } from "../consts/const";
import {
  IAnsweredQuestionEvent,
  IDependentsPagesLogicalValidity,
  IDependentsQuestionsLogicalValidity,
  IDisqualificationRule,
  IEvent,
  IFormula,
  IFormulaEvent,
  ILocation,
  ILogicalValidityCheckRule,
  ILogicalValidityCheckRuleDict,
  IPage,
  IPagesDict,
  IPageTransitionRule,
  IPageTransitionRuleDict,
  IRule,
  ISelectedOptionEvent,
  ISkippedQuestionEvent,
  IStruggledToAnswerEvent,
  ISurveyCompletionRule,
  IUserAnswer,
  IVisibilityQuestionRule,
  IVisibleRuleDict,
} from "../types";
import { questionValidation } from "./questionIsDone";

export const ruleParser = (
  rules: IRule[]
): {
  visiblityRulesDict: IVisibleRuleDict;
  pageTransitionRuleDict: IPageTransitionRuleDict;
  logicalValidityCheckRuleDict: ILogicalValidityCheckRuleDict;
  targetPageTransitionRuleArr: string[];
  surveyCompletionRuleArr: ISurveyCompletionRule[];
  disqualificationRuleArr: IDisqualificationRule[];
} => {
  return rules.reduce(
    (
      res: {
        visiblityRulesDict: IVisibleRuleDict;
        pageTransitionRuleDict: IPageTransitionRuleDict;
        targetPageTransitionRuleArr: string[];
        surveyCompletionRuleArr: ISurveyCompletionRule[];
        disqualificationRuleArr: IDisqualificationRule[];
        logicalValidityCheckRuleDict: ILogicalValidityCheckRuleDict;
      },
      rule: IRule
    ) => {
      if (rule.type === "visibilityQuestionRule") {
        return {
          ...res,
          visiblityRulesDict: {
            ...res.visiblityRulesDict,
            [String(rule.visibleQuestionID)]: rule,
          },
        };
      }
      if (rule.type === "pageTransitionRule") {
        const alreadyHasRuleForPage = res.pageTransitionRuleDict.hasOwnProperty(
          rule.pageID
        );
        if (!alreadyHasRuleForPage) {
          return {
            ...res,
            pageTransitionRuleDict: {
              ...res.pageTransitionRuleDict,
              [String(rule.pageID)]: [rule],
            },
            targetPageTransitionRuleArr: [
              ...res.targetPageTransitionRuleArr,
              String(rule.targetPageID),
            ],
          };
        } else {
          return {
            ...res,
            targetPageTransitionRuleArr: [
              ...res.targetPageTransitionRuleArr,
              String(rule.targetPageID),
            ],
            pageTransitionRuleDict: {
              ...res.pageTransitionRuleDict,
              [String(rule.pageID)]: [
                ...res.pageTransitionRuleDict[String(rule.pageID)],
                rule,
              ],
            },
          };
        }
      }

      if (rule.type === "disqualificationRule") {
        return {
          ...res,
          disqualificationRuleArr: [...res.disqualificationRuleArr, rule],
        };
      }

      if (rule.type === "surveyCompletionRule") {
        return {
          ...res,
          surveyCompletionRuleArr: [...res.surveyCompletionRuleArr, rule],
        };
      }

      if (rule.type === "logicalValidityCheckRule") {
        return {
          ...res,
          logicalValidityCheckRuleDict: {
            ...res.logicalValidityCheckRuleDict,
            [String(rule.docID)]: { logicRule: rule, status: true },
          },
        };
      }

      return res;
    },
    {
      visiblityRulesDict: {},
      pageTransitionRuleDict: {},
      targetPageTransitionRuleArr: [],
      surveyCompletionRuleArr: [],
      disqualificationRuleArr: [],
      logicalValidityCheckRuleDict: {},
    }
  );
};

const eventChecking = (event: IEvent, userAnswers: IUserAnswer): boolean => {
  // проверить isValid
  // console.log(event.type);

  const { type, reverseCondition } = event;

  if (type === "answeredQuestion") {
    const result =
      !!userAnswers[event.questionID] &&
      userAnswers[event.questionID].values.length !== 0 &&
      // userAnswers[event.questionID].values[0].value !== "" &&
      userAnswers[event.questionID].values[0].validationResult.isValid &&
      // !userAnswers[event.questionID].values[0].isFocused &&
      userAnswers[event.questionID].values[0].optionID !== EXTRA_ANSWER.UNABLE;
    return reverseCondition ? result : !result;
  }
  if (type === "skippedQuestion") {
    const result =
      !userAnswers[event.questionID] ||
      (!!userAnswers[event.questionID] &&
        userAnswers[event.questionID].values.length === 0);

    return reverseCondition ? result : !result;
  }
  if (type === "struggledToAnswer") {
    const result =
      !!userAnswers[event.questionID] &&
      userAnswers[event.questionID].values.some(
        (v) => v.optionID === EXTRA_ANSWER.UNABLE
      );
    return reverseCondition ? result : !result;
  }
  if (type === "selectedOption") {
    const result =
      !!userAnswers[event.questionID] &&
      userAnswers[event.questionID].values.some(
        (v) =>
          (v.optionID !== 0 && v.optionID === event.dimention0) ||
          (!!v.dimension0 &&
            !!v.dimension1 &&
            v.dimension0 === String(event.dimention0) &&
            v.dimension1 === String(event.dimention1))
      );
    return reverseCondition ? result : !result;
  }
  if (type === "formula") {
    const { variables } = event.formula;
    if (
      variables.some(
        (v) =>
          (event.reverseCondition && !userAnswers[v.value.questionID]) ||
          (!!userAnswers[v.value.questionID] &&
            userAnswers[v.value.questionID].values.length === 0) ||
          (!!userAnswers[v.value.questionID] &&
            userAnswers[v.value.questionID].values.length > 0 &&
            userAnswers[v.value.questionID].values[0].isFocused)
      )
    ) {
      // console.log("не все значения");
      return false;
    }
    const result = compareExpressions(event.formula, userAnswers);
    return reverseCondition ? result : !result;
  }

  if (type === "grouped") {
    const { eventOperator, events } = event;
    if (events.length === 0) {
      return true;
    }
    if (eventOperator === "AND" || eventOperator === null) {
      return events.every((event) => eventChecking(event, userAnswers));
    }
    if (eventOperator === "OR") {
      return events.some((event) => eventChecking(event, userAnswers));
    }
  }
  return true;
};

export const logicalEventChecking = (
  event: IEvent,
  userAnswers: IUserAnswer
): boolean => {
  // console.log("logicalEventChecking");
  if (event.type === "answeredQuestion") {
    return (
      !!userAnswers[event.questionID] &&
      userAnswers[event.questionID].values.length !== 0 &&
      userAnswers[event.questionID].values[0].value !== "" &&
      !userAnswers[event.questionID].values[0].isFocused &&
      userAnswers[event.questionID].values[0].optionID !== EXTRA_ANSWER.UNABLE
    );
  }
  if (event.type === "skippedQuestion") {
    return (
      !userAnswers[event.questionID] ||
      (!!userAnswers[event.questionID] &&
        userAnswers[event.questionID].values.length === 0)
    );
  }
  if (event.type === "struggledToAnswer") {
    return (
      !!userAnswers[event.questionID] &&
      userAnswers[event.questionID].values.some(
        (v) => v.optionID === EXTRA_ANSWER.UNABLE
      )
    );
  }
  if (event.type === "selectedOption") {
    return (
      !!userAnswers[event.questionID] &&
      userAnswers[event.questionID].values.some(
        (v) =>
          (v.optionID !== 0 && v.optionID === event.optionID) ||
          (!!v.dimension0 &&
            !!v.dimension1 &&
            v.dimension0 === String(event.dimention0) &&
            v.dimension1 === String(event.dimention1))
      )
    );
  }
  if (event.type === "formula") {
    const { variables } = event.formula;
    // console.log("variables");
    if (
      variables.some(
        (v) =>
          !userAnswers[v.value.questionID] ||
          (!!userAnswers[v.value.questionID] &&
            userAnswers[v.value.questionID].values.length === 0) ||
          (!!userAnswers[v.value.questionID] &&
            userAnswers[v.value.questionID].values.length > 0 &&
            userAnswers[v.value.questionID].values[0].isFocused) ||
          (!!userAnswers[v.value.questionID] &&
            userAnswers[v.value.questionID].values.length > 0 &&
            !userAnswers[v.value.questionID].values[0].validationResult.isValid)
      )
    ) {
      // console.log("не все значения!!!");
      // true для logicalEventChecking
      return true;
    }

    return compareExpressions(event.formula, userAnswers);
  }
  if (event.type === "grouped") {
    const { eventOperator, events } = event;
    if (events.length === 0) {
      return true;
    }
    if (eventOperator === "AND" || eventOperator === null) {
      return events.every((event) => logicalEventChecking(event, userAnswers));
    }
    if (eventOperator === "OR") {
      return events.some((event) => logicalEventChecking(event, userAnswers));
    }
  }
  return true;
};

export const logicalValidityChecking = (
  userAnswers: IUserAnswer,
  rule: ILogicalValidityCheckRule
) => {
  const { rootEvent } = rule;
  // const operator = events[0].eventOperator;

  return logicalEventChecking(rootEvent, userAnswers);

  //
  // const { events } = rule;
  // const operator = events[0].eventOperator;
  // if (operator === "AND" || operator === null) {
  //   return events.every((event) => logicalEventChecking(event, userAnswers));
  // }
  // if (operator === "OR") {
  //   return events.some((event) => logicalEventChecking(event, userAnswers));
  // }
  //
  // return true;
};

export const visibleChecking = (
  userAnswers: IUserAnswer,
  rule?: IVisibilityQuestionRule
): boolean => {
  if (!rule) return true;

  const { rootEvent } = rule;
  // const operator = events[0].eventOperator;

  return eventChecking(rootEvent, userAnswers);
  // const { events } = rule;
  // const operator = events[0].eventOperator;
  // if (operator === "AND" || operator === null) {
  //   return events.every((event) => eventChecking(event, userAnswers));
  // }
  // if (operator === "OR") {
  //   return events.some((event) => eventChecking(event, userAnswers));
  // }
  //
  // return true;
};

function removeQuotes(input: string): string {
  return input.replace(/['"]/g, "");
}

const compareExpressions = (formula: IFormula, userAnswers: IUserAnswer) => {
  const { expressionFirst, expressionSecond, operator, variables } = formula;
  const variableValues: Record<string, number> = {};
  for (const variable of variables) {
    variableValues[variable.code] = Number(
      userAnswers[variable.value.questionID].values[0].value
    );
  }
  // console.log("variableValues", variableValues);
  // Заменяем переменные в выражениях на их значения
  const replacedExpressionFirst = replaceVariables(
    removeQuotes(expressionFirst),
    variableValues
  );
  const replacedExpressionSecond = replaceVariables(
    removeQuotes(expressionSecond),
    variableValues
  );
  // console.log("replacedExpressionFirst", replacedExpressionFirst);
  // console.log("replacedExpressionSecond", replacedExpressionSecond);
  // console.log("operator", operator);

  // Выполняем сравнение с учетом оператора
  switch (operator) {
    case "<":
      return eval(replacedExpressionFirst) < eval(replacedExpressionSecond);
    case ">":
      return eval(replacedExpressionFirst) > eval(replacedExpressionSecond);
    case "<>":
      return eval(replacedExpressionFirst) !== eval(replacedExpressionSecond);
    case "=": {
      // console.log("=");
      // console.log(
      //   eval(replacedExpressionFirst) === eval(replacedExpressionSecond)
      // );

      return eval(replacedExpressionFirst) === eval(replacedExpressionSecond);
    }
    default:
      throw new Error("Недопустимый оператор");
  }
};

const replaceVariables = (
  expression: string,
  variableValues: Record<string, number>
): string => {
  // Заменяем коды переменных на их значения в выражении
  for (const code in variableValues) {
    if (variableValues.hasOwnProperty(code)) {
      const value = variableValues[code];
      const variableRegExp = new RegExp(code, "g");
      expression = expression.replace(variableRegExp, value.toString());
    }
  }
  return expression;
};

export const pageTransitionRuleChecking = (
  userAnswers: IUserAnswer,
  rule: IPageTransitionRule
): boolean => {
  const { rootEvent } = rule;
  // const operator = events[0].eventOperator;

  return eventChecking(rootEvent, userAnswers);
  // const { events } = rule;
  // const operator = events[0].eventOperator;
  //
  // if (operator === "AND" || operator === null) {
  //   return events.every((event) => eventChecking(event, userAnswers));
  // }
  // if (operator === "OR") {
  //   return events.some((event) => eventChecking(event, userAnswers));
  // }
  //
  // return false;
};

export const disqualificationRuleChecking = (
  userAnswers: IUserAnswer,
  rule: IDisqualificationRule
): boolean => {
  const { rootEvent } = rule;
  // const operator = events[0].eventOperator;

  // console.log("disqualificationRuleChecking");

  return eventChecking(rootEvent, userAnswers);
  // const { events } = rule;
  // const operator = events[0].eventOperator;
  //
  // if (operator === "AND" || operator === null) {
  //   return events.every((event) => eventChecking(event, userAnswers));
  // }
  // if (operator === "OR") {
  //   return events.some((event) => eventChecking(event, userAnswers));
  // }
  //
  // return false;
};

export const surveyCompletionChecking = (
  userAnswers: IUserAnswer,
  rule: ISurveyCompletionRule
): boolean => {
  const { rootEvent } = rule;
  // const operator = events[0].eventOperator;

  return eventChecking(rootEvent, userAnswers);

  // if (operator === "AND" || operator === null) {
  //   return events.every((event) => eventChecking(event, userAnswers));
  // }
  // if (operator === "OR") {
  //   return events.some((event) => eventChecking(event, userAnswers));
  // }

  // return false;
};

export const firstPageLocation: ILocation = {
  pathName: "section",
  title: "section",
  pageIndex: 0,
  questionIndex: 0,
};

export const disqualificationLocation: ILocation = {
  pathName: "disqualification",
  title: "disqualification",
  pageIndex: 0,
  questionIndex: 0,
};

export const completionLocation: ILocation = {
  pathName: "completion",
  title: "completion",
  pageIndex: 0,
  questionIndex: 0,
};

export type IGetNextLocation = (payload: {
  currentLocation: ILocation;
  pages: IPage[];
  pageCount: number;
  pageTransitionRules: IPageTransitionRule[];
  userAnswers: IUserAnswer;
  pagesDict: IPagesDict;
  targetPageTransitionRuleArr: string[];
  pageMovementLogs: string[];
  visibleRuleDict: IVisibleRuleDict;
}) => ILocation;

type IIsEmptyPage = (payload: {
  page: IPage;
  userAnswers: IUserAnswer;
  visibleRuleDict: IVisibleRuleDict;
}) => boolean;

export const isEmptyPage: IIsEmptyPage = ({
  page,
  userAnswers,
  visibleRuleDict,
}) => {
  const questions = page.questions;
  if (questions.length === 0) return true;
  return questions.some((q) =>
    visibleChecking(userAnswers, visibleRuleDict[String(q.docID)])
  );
};

export const getNextLocation: IGetNextLocation = ({
  currentLocation,
  pageCount,
  pageTransitionRules = [],
  userAnswers,
  pagesDict,
  pages,
  pageMovementLogs,
  targetPageTransitionRuleArr,
  visibleRuleDict,
}) => {
  // правила перехода? -> переход по правилу

  // console.log({
  //   currentLocation,
  //   pageCount,
  //   pageTransitionRules,
  //   userAnswers,
  //   pagesDict,
  //   pages,
  //   pageMovementLogs,
  //   targetPageTransitionRuleArr,
  //   visibleRuleDict,
  // });

  // console.log("rules", rules);

  const successfulRules = pageTransitionRules.filter((rule) =>
    pageTransitionRuleChecking(userAnswers, rule)
  );
  // console.log("successfulRules", successfulRules);

  const targetPagesID = successfulRules.map((rule) => rule.targetPageID);

  ////
  if (targetPagesID.length > 0) {
    targetPagesID.find((targetPageID) => {
      const page = pagesDict[String(targetPageID)].page;
      return !isEmptyPage({ page, userAnswers, visibleRuleDict });
    });
  }

  const firstRuleWithSuccessResult = pageTransitionRules.find((rule) =>
    pageTransitionRuleChecking(userAnswers, rule)
  );
  // console.log("firstRuleWithSuccessResult", firstRuleWithSuccessResult);

  if (firstRuleWithSuccessResult) {
    // console.log("pagesDict", pagesDict);
    // console.log(
    //   "firstRuleWithSuccessResult.targetPageID",
    //   firstRuleWithSuccessResult.targetPageID
    // );
    // console.log(
    //   "firstRuleWithSuccessResult.targetPageID",
    //   pagesDict[String(firstRuleWithSuccessResult.targetPageID)]
    // );

    const pageIndex =
      pagesDict[String(firstRuleWithSuccessResult.targetPageID)].order;
    return {
      pathName: "section",
      title: "section",
      pageIndex: pageIndex,
      questionIndex: 0,
    };
  }
  // последняя страница? -> страница завершения конец

  if (currentLocation.pageIndex + 1 === pageCount) {
    // console.log("completionLocation");
    return completionLocation;
  }

  // проверить что след страница отсутствует в pageMovementLogs
  // проверить что след страница отсутствует в targetPageTransitionRuleArr

  // console.log("targetPageTransitionRuleArr", targetPageTransitionRuleArr);

  const nextPage = pages.find((page, index) => {
    // console.log(index);
    // console.log(
    //   "currentLocation.pageIndex < index",
    //   currentLocation.pageIndex < index
    // );
    // console.log(
    //   "!pageMovementLogs.includes(String(page.docID))",
    //   !pageMovementLogs.includes(String(page.docID))
    // );
    // console.log(
    //   "!targetPageTransitionRuleArr.includes(String(page.docID))",
    //   !targetPageTransitionRuleArr.includes(String(page.docID))
    // );

    return (
      currentLocation.pageIndex < index &&
      !pageMovementLogs.includes(String(page.docID)) &&
      !targetPageTransitionRuleArr.includes(String(page.docID))
    );
  });
  // console.log("nextPage", nextPage);

  if (!nextPage) {
    return completionLocation;
  }

  const pageIndex = pagesDict[String(nextPage.docID)].order;

  // переход к следующему index+1

  return {
    pathName: "section",
    title: "section",
    pageIndex: pageIndex,
    questionIndex: 0,
  };
};

export type IGetPrevLastLocation = (payload: {
  pages: IPage[];
  pagesDict: IPagesDict;
  userAnswers: IUserAnswer;
  pageTransitionRuleDict: IPageTransitionRuleDict;
  disqualificationRuleArr: IDisqualificationRule[];
  surveyCompletionRuleArr: ISurveyCompletionRule[];
  targetPageTransitionRuleArr: string[];
  visibleRuleDict: IVisibleRuleDict;
}) => { location: ILocation; pageMovementLogs: string[] };

export const getPrevLastLocation: IGetPrevLastLocation = ({
  userAnswers,
  pages,
  pagesDict,
  pageTransitionRuleDict,
  targetPageTransitionRuleArr,
  visibleRuleDict,
}) => {
  const pageMovementLogs: string[] = [];
  const location: ILocation = firstPageLocation;

  // есть обязательный без ответа? -> отмена перехода конец
  return findFirstIncompleteQuestionInNextPage({
    currentLocation: location,
    pageMovementLogs,
    pages,
    pagesDict,
    pageTransitionRuleDict,
    userAnswers,
    targetPageTransitionRuleArr,
    visibleRuleDict,
  });
};

type IFindFirstIncompleteQuestionInNextPage = (payload: {
  currentLocation: ILocation;
  pages: IPage[];
  pagesDict: IPagesDict;
  userAnswers: IUserAnswer;
  pageMovementLogs: string[];
  pageTransitionRuleDict: IPageTransitionRuleDict;
  targetPageTransitionRuleArr: string[];
  visibleRuleDict: IVisibleRuleDict;
}) => { location: ILocation; pageMovementLogs: string[] };

export const findFirstIncompleteQuestionInNextPage: IFindFirstIncompleteQuestionInNextPage = ({
  currentLocation,
  pages,
  pagesDict,
  userAnswers,
  pageMovementLogs,
  pageTransitionRuleDict,
  targetPageTransitionRuleArr,
  visibleRuleDict,
}) => {
  const currentPage = pages[currentLocation.pageIndex];
  pageMovementLogs.push(String(currentPage.docID));
  const firstIncompleteQuestion = currentPage.questions.find(
    (q) => q.isRequired && !questionValidation(q, userAnswers)
  );
  if (firstIncompleteQuestion) {
    return {
      location: currentLocation,
      pageMovementLogs: pageMovementLogs,
    };
  }

  const nextLocation = getNextLocation({
    currentLocation: currentLocation,
    pages,
    pageCount: pages.length,
    pagesDict,
    pageTransitionRules: pageTransitionRuleDict[currentPage.docID] ?? [],
    userAnswers,
    targetPageTransitionRuleArr,
    pageMovementLogs,
    visibleRuleDict,
  });

  const hasAnsweredQuestionInNextPage = pages[
    nextLocation.pageIndex
  ].questions.some((q) => userAnswers.hasOwnProperty(String(q.docID)));

  if (
    nextLocation.pathName === "completion" ||
    !hasAnsweredQuestionInNextPage
  ) {
    return {
      // исправлено: было completionLocation. для случая если пользователь ответил на все вопросы, но решил продолжить на другом устройстве
      location: currentLocation,
      pageMovementLogs: pageMovementLogs,
    };
  }

  return findFirstIncompleteQuestionInNextPage({
    currentLocation: nextLocation,
    pageMovementLogs,
    pages,
    pagesDict,
    pageTransitionRuleDict,
    userAnswers,
    targetPageTransitionRuleArr,
    visibleRuleDict,
  });
};

export const getLogicalValidityCheckRulesByQuestionID = (
  rules: ILogicalValidityCheckRule[]
): {
  dependentQuestionsDict: IDependentsQuestionsLogicalValidity;
  dependentPagesDict: IDependentsPagesLogicalValidity;
} => {
  const questionIDToDocIDs: { [key: string]: number[] } = {};
  const pageIDToDocIDs: { [key: string]: number[] } = {};

  function processEvents(
    events: IEvent[] | undefined,
    rule: ILogicalValidityCheckRule
  ) {
    if (!events) return;

    events.forEach((event) => {
      if ("questionID" in event) {
        const questionID = event.questionID;

        if (!questionIDToDocIDs[questionID]) {
          questionIDToDocIDs[questionID] = [];
        }
        questionIDToDocIDs[questionID].push(rule.docID);
      }

      if (event.type === "grouped") {
        processEvents(event.events, rule);
      }

      if (event.type === "formula" && event.formula.variables) {
        event.formula.variables.forEach((variable) => {
          const formulaQuestionID = variable.value.questionID;

          if (!questionIDToDocIDs[formulaQuestionID]) {
            questionIDToDocIDs[formulaQuestionID] = [];
          }
          questionIDToDocIDs[formulaQuestionID].push(rule.docID);
        });
      }
    });
  }

  // Проходим по всем правилам
  rules.forEach((rule) => {
    const { docID, pageID, rootEvent } = rule;
    const pageIDStr = String(rule.pageID);
    if (!pageIDToDocIDs[pageIDStr]) {
      pageIDToDocIDs[pageIDStr] = [];
    }
    pageIDToDocIDs[pageIDStr].push(rule.docID);

    processEvents([rootEvent], rule);
  });

  return {
    dependentQuestionsDict: questionIDToDocIDs,
    dependentPagesDict: pageIDToDocIDs,
  };
};
