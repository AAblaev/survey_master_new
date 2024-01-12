// rules and events
export type IEventType =
  | "answeredQuestion"
  | "skippedQuestion"
  | "selectedOption"
  | "struggledToAnswer"
  | "formula";

export interface IBaseEvent {
  docID: number;
  eventOperator: "AND" | "OR" | null;
  type: IEventType;
}

export type IEvent =
  | IAnsweredQuestionEvent
  | ISkippedQuestionEvent
  | ISelectedOptionEvent
  | IStruggledToAnswerEvent
  | IFormulaEvent;

// 'answeredQuestionEvent'|'skippedQuestionEvent'|'selectedOptionEvent'|'struggledToAnswerEvent'|'formulaEvent'

export interface IAnsweredQuestionEvent extends IBaseEvent {
  type: "answeredQuestion";
  questionID: number;
}
export interface ISkippedQuestionEvent extends IBaseEvent {
  type: "skippedQuestion";
  questionID: number;
}
export interface ISelectedOptionEvent extends IBaseEvent {
  type: "selectedOption";
  questionID: number;
  optionID: number; // для selectedOptionEvent
  dimention0: number; // для selectedOptionEvent
  dimention1: number; // для selectedOptionEvent
  dimention2: number; // для selectedOptionEvent
}
export interface IStruggledToAnswerEvent extends IBaseEvent {
  type: "struggledToAnswer";
  questionID: number;
}
export interface IFormulaEvent extends IBaseEvent {
  type: "formula";
  formula: IFormula;
}

export type IFormula = {
  expressionFirst: string;
  expressionSecond: string;
  operator: "<" | ">" | "<>" | "=";
  variables: IVariable[];
};

export type IVariable = {
  code: string;
  value: {
    questionID: number;
    optionID?: number;
    dimention0?: number;
    dimention1?: number;
    dimention2?: number;
  };
};

export interface IBaseRule {
  docID: number;
  title: string;
  events: IEvent[];
  type:
    | "pageTransitionRule"
    | "surveyCompletionRule"
    | "disqualificationRule"
    | "visibilityQuestionRule"
    | "logicalValidityCheckRule";
}
// 'pageTransition'|'surveyCompletion'|'disqualification'|'visibilityQuestion'
export interface IPageTransitionRule extends IBaseRule {
  type: "pageTransitionRule";
  pageID: number;
  targetPageID: number;
}
export interface ISurveyCompletionRule extends IBaseRule {
  type: "surveyCompletionRule";
}
export interface IDisqualificationRule extends IBaseRule {
  type: "disqualificationRule";
}
export interface IVisibilityQuestionRule extends IBaseRule {
  type: "visibilityQuestionRule";
  questionID: number;
}
export interface ILogicalValidityCheckRule extends IBaseRule {
  type: "logicalValidityCheckRule";
  pageID: number;
}

export type IRule =
  | IPageTransitionRule
  | ISurveyCompletionRule
  | IDisqualificationRule
  | IVisibilityQuestionRule
  | ILogicalValidityCheckRule;

export type IVisibleRuleDict = {
  [key: string]: IVisibilityQuestionRule;
};

export type IPageTransitionRuleDict = {
  [key: string]: IPageTransitionRule[];
};

export type ILogicalValidityCheckRuleDict = {
  [key: string]: { logicRule: ILogicalValidityCheckRule; status: boolean };
};

export type IDependentsQuestionsLogicalValidity = {
  [key: string]: ILogicalValidityCheckRule["docID"][];
};

export type IDependentsPagesLogicalValidity = {
  [key: string]: ILogicalValidityCheckRule["docID"][];
};

export type ICheckingConfig = {
  questionChecking: boolean;
  logicalChecking: boolean;
  disqualificationChecking: boolean;
  completeChecking: boolean;
  immediatelyComplete: boolean;
};

export type IResultCheckingRules = {
  status: boolean;
  deviationPageIndex: number;
};
