export type IPathname =
  | "/"
  | "/campaning"
  | "/section"
  | "/question"
  | "/answer";

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
  disqualificationPage: string;
  completionPage: string;
  limitTime: number;
  pages: IPage[];
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
  branchRules: IBranchRule[];
  quoteRules: IQuoteRule[];
  visibilityRules: IVisibilityRule[];
  config: IConfig;
};

export type IOption = {
  docID: number;
  height: number;
  order: number;
  photoID: number;
  title: string;
  width: number;
};

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
  //
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

export type ILocation = {
  pathName: string;
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
  // relocate to section
  // pageQuestionCount: number;
};
