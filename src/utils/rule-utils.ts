import { EXTRA_ANSWER } from "../consts/const";
import {
  IDisqualificationRule,
  IEvent,
  IFormula,
  ILocation,
  ILogicalValidityCheckRule,
  IPage,
  IPagesDict,
  IPageTransitionRule,
  IPageTransitionRuleDict,
  IRule,
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
  surveyCompletionRuleArr: ISurveyCompletionRule[];
  disqualificationRuleArr: IDisqualificationRule[];
  logicalValidityCheckRuleArr: ILogicalValidityCheckRule[];
} => {
  return rules.reduce(
    (
      res: {
        visiblityRulesDict: IVisibleRuleDict;
        pageTransitionRuleDict: IPageTransitionRuleDict;
        surveyCompletionRuleArr: ISurveyCompletionRule[];
        disqualificationRuleArr: IDisqualificationRule[];
        logicalValidityCheckRuleArr: ILogicalValidityCheckRule[];
      },
      rule: IRule
    ) => {
      if (rule.type === "visibilityQuestionRule") {
        return {
          ...res,
          visiblityRulesDict: {
            ...res.visiblityRulesDict,
            [String(rule.questionID)]: rule,
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
          };
        } else {
          return {
            ...res,
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
          logicalValidityCheckRuleArr: [
            ...res.logicalValidityCheckRuleArr,
            rule,
          ],
        };
      }

      return res;
    },
    {
      visiblityRulesDict: {},
      pageTransitionRuleDict: {},
      surveyCompletionRuleArr: [],
      disqualificationRuleArr: [],
      logicalValidityCheckRuleArr: [],
    }
  );
};

const eventChecking = (event: IEvent, userAnswers: IUserAnswer): boolean => {
  if (event.type === "answeredQuestion") {
    return (
      !!userAnswers[event.questionID] &&
      userAnswers[event.questionID].values.length !== 0 &&
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
    if (
      variables.some(
        (v) =>
          !userAnswers[v.value.questionID] ||
          (!!userAnswers[v.value.questionID] &&
            userAnswers[v.value.questionID].values.length === 0) ||
          (!!userAnswers[v.value.questionID] &&
            userAnswers[v.value.questionID].values.length > 0 &&
            userAnswers[v.value.questionID].values[0].isFocused)
      )
    ) {
      console.log("не все значения");
      return false;
    }

    return compareExpressions(event.formula, userAnswers);
  }
  return true;
};

export const visibleChecking = (
  userAnswers: IUserAnswer,
  rule?: IVisibilityQuestionRule
): boolean => {
  // console.log("visiblle checking", userAnswers);
  if (!rule) return true;

  const { events } = rule;
  const operator = events[0].eventOperator;
  if (operator === "AND" || operator === null) {
    return events.every((event) => eventChecking(event, userAnswers));
  }
  if (operator === "OR") {
    return events.some((event) => eventChecking(event, userAnswers));
  }

  return true;
};

const compareExpressions = (formula: IFormula, userAnswers: IUserAnswer) => {
  const { expressionFirst, expressionSecond, operator, variables } = formula;
  const variableValues: Record<string, number> = {};
  for (const variable of variables) {
    variableValues[variable.code] = Number(
      userAnswers[variable.value.questionID].values[0].value
    );
  }

  // Заменяем переменные в выражениях на их значения
  const replacedExpressionFirst = replaceVariables(
    expressionFirst,
    variableValues
  );
  const replacedExpressionSecond = replaceVariables(
    expressionSecond,
    variableValues
  );

  // Выполняем сравнение с учетом оператора
  switch (operator) {
    case "<":
      return eval(replacedExpressionFirst) < eval(replacedExpressionSecond);
    case ">":
      return eval(replacedExpressionFirst) > eval(replacedExpressionSecond);
    case "<>":
      return eval(replacedExpressionFirst) !== eval(replacedExpressionSecond);
    case "=":
      return eval(replacedExpressionFirst) === eval(replacedExpressionSecond);
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
  const { events, title } = rule;
  const operator = events[0].eventOperator;

  if (operator === "AND" || operator === null) {
    return events.every((event) => eventChecking(event, userAnswers));
  }
  if (operator === "OR") {
    return events.some((event) => eventChecking(event, userAnswers));
  }

  return false;
};

export const disqualificationRuleChecking = (
  userAnswers: IUserAnswer,
  rule: IDisqualificationRule
): boolean => {
  const { events, title } = rule;
  const operator = events[0].eventOperator;

  if (operator === "AND" || operator === null) {
    return events.every((event) => eventChecking(event, userAnswers));
  }
  if (operator === "OR") {
    return events.some((event) => eventChecking(event, userAnswers));
  }

  return false;
};

export const surveyCompletionChecking = (
  userAnswers: IUserAnswer,
  rule: ISurveyCompletionRule
): boolean => {
  const { events, title } = rule;
  const operator = events[0].eventOperator;

  if (operator === "AND" || operator === null) {
    return events.every((event) => eventChecking(event, userAnswers));
  }
  if (operator === "OR") {
    return events.some((event) => eventChecking(event, userAnswers));
  }

  return false;
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
  // pages: IPage[];
  pageCount: number;
  rules: IPageTransitionRule[];
  userAnswers: IUserAnswer;
  pagesDict: IPagesDict;
  // pageMovementLogs: string[];
}) => ILocation;

export const getNextLocation: IGetNextLocation = ({
  currentLocation,
  pageCount,
  rules,
  userAnswers,
  pagesDict,
}) => {
  // правила перехода? -> переход по правилу

  console.log("rules", rules);

  const firstRuleWithSuccessResult = rules.find((rule) =>
    pageTransitionRuleChecking(userAnswers, rule)
  );

  if (firstRuleWithSuccessResult) {
    const pageIndex = pagesDict[firstRuleWithSuccessResult.targetPageID].order;
    return {
      pathName: "section",
      title: "section",
      pageIndex: pageIndex,
      questionIndex: 0,
    };
  }
  // последняя страница? -> страница завершения конец

  if (currentLocation.pageIndex + 1 === pageCount) {
    return completionLocation;
  }

  // переход к следующему index+1

  return {
    pathName: "section",
    title: "section",
    pageIndex: currentLocation.pageIndex + 1,
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
}) => { location: ILocation; pageMovementLogs: string[] };

export const getPrevLastLocation: IGetPrevLastLocation = ({
  disqualificationRuleArr,
  surveyCompletionRuleArr,
  userAnswers,
  pages,
  pagesDict,
  pageTransitionRuleDict,
}) => {
  const pageMovementLogs: string[] = [];
  const location: ILocation = firstPageLocation;

  // дисквалификация? -> дисквалификация конец
  if (
    disqualificationRuleArr.some((rule) =>
      disqualificationRuleChecking(userAnswers, rule)
    )
  ) {
    return {
      location: disqualificationLocation,
      pageMovementLogs: pageMovementLogs,
    };
  }

  // complete? -> страница завершения конец
  if (
    surveyCompletionRuleArr.some((rule) =>
      surveyCompletionChecking(userAnswers, rule)
    )
  ) {
    return {
      location: completionLocation,
      pageMovementLogs: pageMovementLogs,
    };
  }
  // есть обязательный без ответа? -> отмена перехода конец
  return findFirstIncompleteQuestionInNextPage({
    currentLocation: location,
    pageMovementLogs,
    pages,
    pagesDict,
    pageTransitionRuleDict,
    userAnswers,
  });
};

type IFindFirstIncompleteQuestionInNextPage = (payload: {
  currentLocation: ILocation;
  pages: IPage[];
  pagesDict: IPagesDict;
  userAnswers: IUserAnswer;
  pageMovementLogs: string[];
  pageTransitionRuleDict: IPageTransitionRuleDict;
}) => { location: ILocation; pageMovementLogs: string[] };

export const findFirstIncompleteQuestionInNextPage: IFindFirstIncompleteQuestionInNextPage = ({
  currentLocation,
  pages,
  pagesDict,
  userAnswers,
  pageMovementLogs,
  pageTransitionRuleDict,
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
    pageCount: pages.length,
    pagesDict,
    rules: pageTransitionRuleDict[currentPage.docID] ?? [],
    userAnswers,
  });

  if (nextLocation.pathName === "completion") {
    return {
      location: completionLocation,
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
  });
};
