import { ILocation, ISlideMoveDirection, IStyles } from "../types";

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

export const FAKE_PAGE_LOCATION: ILocation = {
  pathName: "section",
  title: "section",
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
  UNABLE = -1, // затрудняюсь
  NOTHING = -2, // ничеко из вышеперечисленного
  OTHER = -3, // другое
}

export const DEFAULT_HINT_VALUE = "";
export const DEFAULT_COLUMNS_COUNT = 2;

export const DEFAULT_IS_LIMIT_TIME = true;
export const DEFAULT_LIMIT_TIME = 2400;

export const DEFAULT_STYLES: IStyles = {
  globalStyle: {
    brandColor: "#46acaf",
    background: {
      color: "#f9f9f9",
    },
  },

  componentsStyle: {
    appBar: {
      background: {
        color: "#46acaf",
      },
      font: {
        size: 14,
        color: "#ffffff",
      },
    },
    progressBar: {
      title: {
        font: {
          size: 11,
          color: "#46acaf",
        },
      },
      progress: {
        strokeColor: ["#108ee9", "#87d068"],
        trailColor: "#e5e5e5",
      },
    },
    question: {
      background: {
        color: "#e5e5e5",
      },
      title: {
        font: {
          size: 19,
          color: "#000000",
        },
      },
      counter: {
        font: {
          size: 19,
          color: "#46acaf",
        },
      },
      border: {
        size: 1,
        color: "#e5e5e5",
      },
      table: {
        firstColumnWidth: 250,
      },
    },
    questionGroup: {
      background: {
        color: "#fff",
      },
      title: {
        font: {
          size: 19,
          color: "#000000",
        },
        padding: "0px 10px 0px 10px",
      },
      counter: {
        font: {
          size: 19,
          color: "#2b406a",
        },
      },
      border: {
        size: 1,
        color: "#e5e5e5",
        radius: 4,
      },
      elevation: 2,
      details: {
        padding: "0px 10px 0px 20px",
      },
    },
  },
};

export const SUCCESS_CHECKING_RESULT = {
  status: true,
  message: "success",
  modalMessage: {
    code: 200,
    type: "success",
  },
};
