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
  byTimerPage: string;
  isShowButtonBack: boolean;
  isShowCompletionPage: boolean;
  isShowDisqualificationPage: boolean;
  isShowQuestionsCount: boolean;
  isShowProgressbar: boolean;
  isShowPageList: boolean;
  isShowSurveyName: boolean;
  disqualificationPage: string;
  completionPage: string;
  limitTime: number;
  limitTimeLeft: number;
  pages: IPage[];
  buttonBackCaption: string;
  buttonFinishCaption: string;
  buttonNextCaption: string;
  buttonStartCaption: string;
  answers: IBackendAnswer[];
  rules: IRule[];
  colorScheme: {
    docID: number;
    jsonStyle: IStyles;
  };
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
  branchRules?: IBranchRule[];
  quoteRules?: IQuoteRule[];
  visibilityRules?: IVisibilityRule[];
  config: IConfig;
  isRequired: boolean;
  hasOtherAnswer: boolean;
  hasNothingAnswer: boolean;
  hasUnableAnswer: boolean;
  difficultToAnswerPlaceholder: string;
  nothingPlaceholder: string;
  otherPlaceholder: string;
  hint?: string;
  scaleType?: number;
};

// difficultToAnswerPlaceholder:"Затрудняюсь ответить"
// nothingPlaceholder: "Ничего из вышеперечисленного"
// otherPlaceholder: "Другое"

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
  simpleType: ISimpleType;
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
  isSimpleDateLimit?: boolean;
  simpleDateMax?: string;
  simpleDateMin?: string;
  //
  dateType?: unknown;
  scaleType?: unknown;
  mobileTabularView?: boolean;
  isChooseManyInrow?: boolean;
  isChooseManyIncol?: boolean;
  requiredColunmsCount?: number;
  requiredRowsCount?: number;
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
  | "completion_by_timer"
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

export type IPagesDict = {
  [key: string]: { page: IPage; order: number };
};

export type ISlideMoveDirection = "left-to-right" | "right-to-left";

// rules and events
export type IEventType =
  | "answeredQuestion"
  | "skippedQuestion"
  | "selectedOption"
  | "struggledToAnswer"
  | "formula"
  | "grouped";

export interface IBaseEvent {
  docID: number;
  eventOperator: "AND" | "OR" | null;
  type: IEventType;
  reverseCondition: boolean;
}

export type IEvent =
  | IAnsweredQuestionEvent
  | ISkippedQuestionEvent
  | ISelectedOptionEvent
  | IStruggledToAnswerEvent
  | IFormulaEvent
  | IGroupedQuestionEvent;

// 'answeredQuestionEvent'|'skippedQuestionEvent'|'selectedOptionEvent'|'struggledToAnswerEvent'|'formulaEvent'

export interface IGroupedQuestionEvent extends IBaseEvent {
  type: "grouped";
  events: IEvent[];
}
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
  dimention0?: number; // для selectedOptionEvent
  dimention1?: number; // для selectedOptionEvent
  dimention2?: number; // для selectedOptionEvent
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
  rootEvent: IEvent;
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
  visibleQuestionID: number;
}
export interface ILogicalValidityCheckRule extends IBaseRule {
  type: "logicalValidityCheckRule";
  pageID: number;
}

// const oldRules = [
//   {
//     docID: 301,
//     type: "logicalValidityCheckRule",
//     pageID: 526,
//     targetPageID: 0,
//     visibleQuestionID: 0,
//     questionID: 0,
//     rootEvent: {
//       docID: 301,
//       questionID: 0,
//       eventOperator: "AND",
//       type: "grouped",
//       reverseCondition: false,
//       dimention0: 0,
//       dimention1: 0,
//       dimention2: 0,
//       formula: null,
//       events: [
//         {
//           docID: 303,
//           questionID: 920,
//           eventOperator: null,
//           type: "selectedOption",
//           reverseCondition: true,
//           dimention0: 3615,
//           dimention1: 0,
//           dimention2: 0,
//           formula: null,
//           events: [],
//         },
//         {
//           docID: 304,
//           questionID: 919,
//           eventOperator: null,
//           type: "selectedOption",
//           reverseCondition: true,
//           dimention0: 3612,
//           dimention1: 0,
//           dimention2: 0,
//           formula: null,
//           events: [],
//         },
//       ],
//     },
//   },
// ];
// const new_rules: ILogicalValidityCheckRule[] = [
//   {
//     type: "logicalValidityCheckRule",
//     docID: 301,
//     pageID: 526,
//     title: "Вы нам не подходите по возрасту",
//     targetPageID: 0,
//     visibleQuestionID: 0,
//     questionID: 0,
//     rootEvent: {
//       docID: 1,
//       eventOperator: "AND",
//       type: "grouped",
//       reverseCondition: false,
//       events: [
//         {
//           docID: 2,
//           reverseCondition: false,
//           type: "selectedOption",
//           dimention0: 3615,
//           dimention1: 0,
//           dimention2: 0,
//           formula: null,
//           questionID: 920,
//           eventOperator: null,
//             events: [],
//         },
//       ],
//     },
//   },
//
//   {
//     type: "logicalValidityCheckRule",
//     docID: 302,
//     pageID: 526,
//     title: "Нам нужны водители",
//     rootEvent: {
//       docID: 1,
//       eventOperator: "AND",
//       type: "grouped",
//       reverseCondition: false,
//       events: [
//         {
//           docID: 3,
//           reverseCondition: false,
//           type: "selectedOption",
//           dimention0: 3612,
//           dimention1: 0,
//           dimention2: 0,
//           formula: null,
//           questionID: 919,
//           eventOperator: null,
//           events: [],
//         },
//       ],
//     },
//   },
// ];

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

export type IModalMessageType = "greeting" | "cancelTransition" | "completion";

export type IModalMessage =
  | {
      code: 101;
      type: "greeting";
    }
  | {
      code: 201;
      type: "cancelTransition";
    }
  | {
      code: 202;
      type: "cancelTransition";
    }
  | {
      code: 301;
      type: "completion";
    }
  | {
      code: 302;
      type: "completion";
    }
  | {
      code: 303;
      type: "completion";
    }
  | { code: 401; type: "disqualification" };

export type IStyles = {
  globalStyle: {
    brandColor: string;
    background: {
      color: string;
    };
  };

  componentsStyle: {
    appBar: {
      background: {
        color: string;
      };
      font: {
        size: number;
        color: string;
      };
    };
    progressBar: {
      title: {
        font: {
          size: number;
          color: string;
        };
      };
      progress: {
        strokeColor: string[];
        trailColor: string;
      };
    };
    question: {
      background: {
        color: string;
      };
      title: {
        font: {
          size: number;
          color: string;
        };
      };
      counter: {
        font: {
          size: number;
          color: string;
        };
      };
      border: {
        size: number;
        color: string;
      };
      table: {
        firstColumnWidth: number;
      };
    };

    questionGroup: {
      background: {
        color: string;
      };
      title: {
        font: {
          size: number;
          color: string;
        };
        padding: string;
      };
      counter: {
        font: {
          size: number;
          color: string;
        };
      };
      border: {
        size: number;
        color: string;
        radius: number;
      };
      elevation: number;
      details: {
        padding: string;
      };
    };
  };
};

export type IPageMovementLog = {
  docID: number;
  firstVisitTime: number;
};

export type IState = {
  loading: boolean;
  error: IError;
  data: IParsedData | null;
  location: ILocation;
  firstLocationWithDeviation: ILocation;
  params: IParams;
  userAnswers: IUserAnswer;
  slideMoveDirection: ISlideMoveDirection;
  modalVisible: boolean;
  modalMessage: IModalMessage;
  visitedPageDocIDList: string[];
  needScrolling: boolean;
  // переименовать visiblityRulesDict --> visibilityQuestionRuleDuct
  visiblityRulesDict: IVisibleRuleDict;
  pageTransitionRuleDict: IPageTransitionRuleDict;
  logicalValidityCheckRuleDict: ILogicalValidityCheckRuleDict;
  dependentQuestionsDict: IDependentsQuestionsLogicalValidity;
  dependentPagesDict: IDependentsPagesLogicalValidity;
  targetPageTransitionRuleArr: string[];
  disqualificationRuleArr: IDisqualificationRule[];
  surveyCompletionRuleArr: ISurveyCompletionRule[];
  pagesDict: IPagesDict;
  pageMovementLogs: IPageMovementLog[];
  strictModeNavigation: boolean;
  styles: IStyles;
  timerTime: number;
  showTimer: boolean;
};
