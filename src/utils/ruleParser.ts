import { IRule, IVisibleRuleDict } from "../types";

export const ruleParser = (rules: IRule[]): IVisibleRuleDict => {
  return rules.reduce((res, rule) => {
    if (rule.type === "visibilityQuestionRule") {
      return { ...res, [String(rule.questionID)]: rule };
    }
    return res;
  }, {});
};
