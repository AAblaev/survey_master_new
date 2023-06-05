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
  disqualificationPage: string;
  completionPage: string;
  limitTime: number;
  pages: IPage[];
  buttonBackCaption: string;
  buttonFinishCaption: string;
  buttonNextCaption: string;
  buttonStartCaption: string;
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
  comment: string;
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
  options?: IOption[];
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
  limitValue?: {
    min: number;
    max: number;
  };
};

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
  | "default";

export type IAnswer = {
  questionID: number;
  values: { optionID: number; value: string }[];
  // unable_answer: boolean;
  // nothing_answer: boolean;
  // other_answer: { enabled: boolean; value: string };
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
  // relocate to section
  // pageQuestionCount: number;
};
