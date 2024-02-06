import {
  IDependentsPagesLogicalValidity,
  ILogicalValidityCheckRuleDict,
  IUserAnswer,
} from "../types";
import { logicalValidityChecking } from "./rule-utils";

type ILogicalRulesChecking = (payload: {
  pageDocID: number;
  dependentPagesDict: IDependentsPagesLogicalValidity;
  logicalValidityCheckRuleDict: ILogicalValidityCheckRuleDict;
  userAnswers: IUserAnswer;
  logicalChecking: boolean;
}) => ILogicalRulesCheckingResult;

type ILogicalRulesCheckingResult = {
  status: boolean;
  modalMessage: { code: number; type: string };
  newLogicalValidityRuleValues: ILogicalValidityCheckRuleDict;
};

const logicalRulesChecking: ILogicalRulesChecking = ({
  pageDocID,
  dependentPagesDict,
  logicalValidityCheckRuleDict,
  userAnswers,
  logicalChecking,
}) => {
  // console.log("pageDocID", {
  //   pageDocID,
  //   dependentPagesDict,
  //   logicalValidityCheckRuleDict,
  //   userAnswers,
  //   logicalChecking,
  // });
  if (!logicalChecking) {
    return {
      status: true,
      modalMessage: { code: 100, type: "success" },
      newLogicalValidityRuleValues: {},
    };
  }

  const logicalValidityRuleDocIDs: number[] = dependentPagesDict[
    String(pageDocID)
  ]
    ? dependentPagesDict[String(pageDocID)]
    : [];

  if (logicalValidityRuleDocIDs.length === 0) {
    // console.log("logicalValidityRuleDocIDs.length === 0");
    return {
      status: true,
      modalMessage: { code: 100, type: "success" },
      newLogicalValidityRuleValues: {},
    };
  }

  const newLogicalValidityRuleValues = logicalValidityRuleDocIDs.reduce(
    (res, id) => {
      const logicRule = logicalValidityCheckRuleDict[String(id)].logicRule;
      return {
        ...res,
        [String(id)]: {
          logicRule: logicRule,
          status: logicalValidityChecking(userAnswers, logicRule),
        },
      };
    },
    {} as ILogicalValidityCheckRuleDict
  );

  const allLogicRulesAreSuccess = Object.values(
    newLogicalValidityRuleValues
  ).every((rule) => rule.status);

  if (allLogicRulesAreSuccess) {
    // console.log("allLogicRulesAreSuccess");

    return {
      status: true,
      modalMessage: { code: 100, type: "success" },
      newLogicalValidityRuleValues: {},
    };
  }

  return {
    status: false,
    modalMessage: { code: 202, type: "cancelTransition" },
    newLogicalValidityRuleValues,
  };
};

export default logicalRulesChecking;
