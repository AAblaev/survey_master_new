import { ISlideMoveDirection } from "../types";

export const DEFAULT_QUESTION_INDEX = 0;
export const DEFAULT_PAGE_INDEX = 0;

export const DEFAULT_MOVE_DIRECTION: ISlideMoveDirection = "left-to-right";
export const TIMEOUT_VALUE = 500;

export const DEFAULT_STROKE = {
  "0%": "#108ee9",
  "100%": "#87d068",
};

export const DEFAULT_BACKGROUND_COLOR = "#F9F9F9";
export const PRIMARY_COLOR = "#46acaf";

export enum EXTRA_ANSWER {
  UNABLE = -1,
  NOTHING = -2,
  OTHER = -3,
}

export const DEFAULT_HINT_VALUE = "- выбрать -";
