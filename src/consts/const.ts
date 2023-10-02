import { ILocation, ISlideMoveDirection } from "../types";

export const DEFAULT_QUESTION_INDEX = 0;
export const DEFAULT_PAGE_INDEX = 0;

export const GREETING_PAGE_LOCATION: ILocation = {
  pathName: "greeting",
  title: "greeting",
  pageIndex: 0,
  questionIndex: 0,
};

export const PAGE_LIST_LOCATION: ILocation = {
  pathName: "survey",
  title: "survey",
  pageIndex: 0,
  questionIndex: 0,
};

export const FIRST_PAGE_LOCATION: ILocation = {
  pathName: "section",
  title: "section",
  pageIndex: 0,
  questionIndex: 0,
};

export const DISQUALIFICATION_PAGE_LOCATION: ILocation = {
  pathName: "disqualification",
  title: "disqualification",
  pageIndex: 0,
  questionIndex: 0,
};

export const COMPLETION_PAGE_LOCATION: ILocation = {
  pathName: "completion",
  title: "completion",
  pageIndex: 0,
  questionIndex: 0,
};

export const DEFAULT_MOVE_DIRECTION: ISlideMoveDirection = "left-to-right";
export const TIMEOUT_VALUE = 600;

export const DEFAULT_STROKE_COLOR = {
  "0%": "#108ee9",
  "100%": "#87d068",
};

export const DEFAULT_TRAIL_COLOR = "#e5e5e5";

export const DEFAULT_BACKGROUND_COLOR = "#F9F9F9";
export const PRIMARY_COLOR = "#46acaf";

export enum EXTRA_ANSWER {
  UNABLE = -1,
  NOTHING = -2,
  OTHER = -3,
}

export const DEFAULT_HINT_VALUE = "";
export const DEFAULT_COLUMNS_COUNT = 2;

export const DEFAULT_IS_LIMIT_TIME = true;
export const DEFAULT_LIMIT_TIME = 2400;
