// export type IPathname =
//   | "/"
//   | "/campaning"
//   | "/section"
//   | "/question"
//   | "/answer";

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
  optionID: number | string;
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

/////
export type IError = {
  status: boolean;
  message: string;
};

export type IParams = {
  [key: string]: string;
};

export type IParsedData = IData;
export type IPageName = string;
export type IPathName = "greeting" | "survey" | "section" | "completion";

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
  // relocate to section
  // pageQuestionCount: number;
};

// const test = {
//   is_enable: true,
//   is_time_limited: false,
//   time_limit: 0,
//   is_show_by_button: false,
//   is_save_time: false,
//   moderation_comment: "",
//   title: "матрица",
//   comment_source: "",
//   comment_compiled: "",
//   has_comment: false,
//   is_required: false,
//   has_unable_answer: false,
//   unable_answer_text: "",
//   is_confirmable: false,
//   options_sort: "default",
//   rows_sort: "default",
//   is_multiselect: false,
//   is_multiselect_column: true,
//   is_hide_rows_name: false,
//   is_hide_options_name: false,
//   options: [
//     {
//       id: 15003594,
//       uid: "option-34",
//       title: "11",
//       image_id: null,
//       image: [],
//       values: [],
//       image_width: null,
//       image_height: null,
//       image_alt: "",
//       image_align: null,
//       point: 0,
//       comment: "",
//     },
//     {
//       id: 15003595,
//       uid: "option-35",
//       title: "22",
//       image_id: null,
//       image: [],
//       values: [],
//       image_width: null,
//       image_height: null,
//       image_alt: "",
//       image_align: null,
//       point: 0,
//       comment: "",
//     },
//     {
//       id: 15003596,
//       uid: "option-36",
//       title: "33",
//       image_id: null,
//       image: [],
//       values: [],
//       image_width: null,
//       image_height: null,
//       image_alt: "",
//       image_align: null,
//       point: 0,
//       comment: "",
//     },
//   ],
//   options_related: [],
//   options_related_unselected: [],
//   rows: [
//     {
//       id: 147,
//       uid: "row-37",
//       title: "1",
//       image_id: null,
//       image: [],
//       image_width: null,
//       image_height: null,
//       image_alt: "",
//       image_align: null,
//     },
//     {
//       id: 148,
//       uid: "row-38",
//       title: "2",
//       image_id: null,
//       image: [],
//       image_width: null,
//       image_height: null,
//       image_alt: "",
//       image_align: null,
//     },
//     {
//       id: 149,
//       uid: "row-39",
//       title: "3",
//       image_id: null,
//       image: [],
//       image_width: null,
//       image_height: null,
//       image_alt: "",
//       image_align: null,
//     },
//   ],
//   rows_related: [],
//   rows_related_unselected: [],
//   required_min: null,
//   required_min_col: 1,
//   is_mobile_disabled: false,
//   is_flip_rows_cols: false,
// };
