import { EXTRA_ANSWER } from "../consts/const";
import {
  IEvent,
  IFormula,
  IRule,
  IUserAnswer,
  IVisibilityQuestionRule,
  IVisibleRuleDict,
} from "../types";

export const ruleParser = (rules: IRule[]): IVisibleRuleDict => {
  return rules.reduce((res, rule) => {
    if (rule.type === "visibilityQuestionRule") {
      return { ...res, [String(rule.questionID)]: rule };
    }
    return res;
  }, {});
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
) => {
  console.log("visiblle checking", userAnswers);
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
