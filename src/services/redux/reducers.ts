import { DEFAULT_MOVE_DIRECTION } from "../../consts/const";
import { IState } from "../../types";
import { IAction } from "./actions.types";
import {
  CHANGE_CURRENT_LOCATION,
  SET_NEW_DATA,
  SET_SURVEY_UID,
  SET_USER_ANSWER,
  IS_LOADING,
  IS_ERROR,
  TOGGLE_MODAL_VISIBLE,
  SET_VISITED_PAGE_DOCID,
  // IS_ERROR,
} from "./types";

const initialState: IState = {
  loading: false,
  error: { message: "", status: false },
  modalVisible: false,
  data: null,
  location: {
    pathName: "greeting",
    title: "greeting",
    pageIndex: 0,
    questionIndex: 0,
  },
  params: {},
  userAnswers: {},
  slideMoveDirection: DEFAULT_MOVE_DIRECTION,
  visitedPageDocIDList: [],
};

export const reducer = (state: IState = initialState, action: IAction) => {
  switch (action.type) {
    case SET_NEW_DATA: {
      return { ...state, data: action.payload };
    }

    case IS_LOADING: {
      return { ...state, loading: action.payload };
    }

    case IS_ERROR: {
      return { ...state, error: action.payload };
    }

    case SET_SURVEY_UID: {
      return {
        ...state,
        params: {
          ...state.params,
          uid: action.payload,
        },
      };
    }

    case CHANGE_CURRENT_LOCATION: {
      return {
        ...state,
        location: action.payload.location,
        slideMoveDirection: action.payload.slideMoveDirection,
      };
    }

    case SET_USER_ANSWER: {
      const { questionID } = action.payload;
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [questionID]: action.payload,
        },
      };
    }

    case TOGGLE_MODAL_VISIBLE: {
      return {
        ...state,
        modalVisible: action.payload,
      };
    }
    case SET_VISITED_PAGE_DOCID: {
      return {
        ...state,
        visitedPageDocIDList: state.visitedPageDocIDList.includes(
          action.payload
        )
          ? state.visitedPageDocIDList
          : [...state.visitedPageDocIDList, action.payload],
      };
    }

    default: {
      return { ...state };
    }
  }
};
