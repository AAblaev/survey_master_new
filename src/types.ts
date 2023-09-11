export type IData = {
  docID: number;
  name: string;
  isClosed: boolean;
  beginDate: string;
  endDate: string;
  closeDate: string;
  isLimitTimeForCompletion: boolean;
  isShowGreetingsPage: boolean;
  greetingsPage: string;
  isShowCompletionPage: boolean;
  isShowDisqualificationPage: boolean;
  isShowQuestionsCount: boolean;
  isShowProgressbar: boolean;
  isShowPageList: boolean;
  disqualificationPage: string;
  completionPage: string;
  limitTime: number;
  pages: IPage[];
  buttonBackCaption: string;
  buttonFinishCaption: string;
  buttonNextCaption: string;
  buttonStartCaption: string;
  answers: IBackendAnswer[];
  rules: IRule[];
};

export type IPage = {
  docID: number;
  title: string;
  surveyID: number;
  order: number;
  questions: IQuestion[];
};

export type IQuestion = {
  docID: number;
  surveyID: number; //???
  pageID: number;
  type: number; //???
  title: string;
  order: number;
  comment: string | null;
  hasComment?: boolean;
  branchRules: IBranchRule[];
  quoteRules: IQuoteRule[];
  visibilityRules: IVisibilityRule[];
  config: IConfig;
  isRequired: boolean;
  hasOtherAnswer: boolean;
  hasNothingAnswer: boolean;
  hasUnableAnswer: boolean;
  hint?: string;
  scaleType?: number;
};

export type IOption = {
  docID: number;
  height: number;
  order: number;
  photoID: number;
  title: string;
  width: number;
  dimension?: number;
};

export type IView =
  | "stars"
  | "table"
  | "color"
  | "smiles"
  | "smiles-monochrome";

export type IOrientation = "horizontal" | "vertical";

export type IConfig = {
  dataType: IDataType;
  isConfirmable: boolean;
  isEnable: boolean;
  isMultiline: boolean;
  isRequired: boolean;
  isSaveTime: boolean;
  isShowOnButton: boolean;
  isTimeLimited: boolean;
  timeLimit: number;
  title: string;
  options?: IOption[] | null;
  simpleType?: ISimpleType;
  view?: IView;
  orientation?: IOrientation;
  //
  columnsCount?: number;
  isLimited?: boolean;
  isLimitedValue?: boolean;
  limit?: {
    min: number;
    max: number;
  };
  limitValue?:
    | {
        min: number;
        max: number;
      }
    | {
        min: string;
        max: string;
      };
  //
  dateType?: unknown;
  scaleType?: unknown;
  mobileTabularView?: boolean;
  isChooseManyInrow?: boolean;
  isChooseManyIncol?: boolean;
};
export type ISimpleType =
  | "boolean"
  | "string"
  | "integer"
  | "float"
  | "datetime"; //number, float, date

export type IDataType =
  | "select"
  | "dropdown"
  | "multiselect"
  | "multidropdown"
  | "matrix"
  | "matrix3d"
  | "free"
  | "freelist"
  | "freematrix"
  | "order"
  | "ratingscale"
  | "paircompare"
  | "complex"
  | "scale"
  | "html"
  | "textblock"
  | "default";

export type IValidationResult = {
  isValid: boolean;
  message: string;
};

export type IValue = {
  optionID: number;
  value: string;
  dimension0?: string;
  dimension1?: string;
  dimension2?: string;
  validationResult: IValidationResult;
  isFocused: boolean;
};

export type IBackendAnswer = {
  questionID: number;
  values: Omit<IValue, "validationResult" | "isFocused">[];
};

export type IAnswer = {
  questionID: number;
  values: IValue[];
};

export type IBranchRule = {};
export type IQuoteRule = {};
export type IVisibilityRule = {};

export type IError = {
  status: boolean;
  message: string;
};

export type IParams = {
  [key: string]: string;
};

export type IParsedData = IData;
export type IPageName = string;
export type IPathName =
  | "greeting"
  | "survey"
  | "section"
  | "completion"
  | "disqualification";

export type ILocation = {
  pathName: IPathName;
  title: string;
  pageIndex: number;
  questionIndex: number;
};

export type IUserAnswer = {
  [key: string]: IAnswer;
};

export type ISlideMoveDirection = "left-to-right" | "right-to-left";

// rules and events
export type IEventType =
  | "answeredQuestion"
  | "skippedQuestion"
  | "selectedOption"
  | "struggledToAnswer"
  | "formula";

export interface IBaseEvent {
  docID: number;
  // questionID: number;
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

export type IState = {
  loading: boolean;
  error: IError;
  data: IParsedData | null;
  location: ILocation;
  params: IParams;
  userAnswers: IUserAnswer;
  slideMoveDirection: ISlideMoveDirection;
  modalVisible: boolean;
  visitedPageDocIDList: string[];
  needScrolling: boolean;
  visiblityRulesDict: IVisibleRuleDict;
  pageTransitionRuleDict: IPageTransitionRuleDict;
};
