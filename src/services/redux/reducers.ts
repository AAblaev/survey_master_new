import { DEFAULT_MOVE_DIRECTION } from "../../consts/const";
import { IState } from "../../types";
import { IAction } from "./actions.types";
import {
  CHANGE_CURRENT_LOCATION,
  SET_NEW_DATA,
  SET_USER_ANSWER,
} from "./types";

const initialState: IState = {
  loading: false,
  error: { message: "", status: false },
  data: null,
  location: {
    pathName: "/campaning",
    title: "campaning",
    pageIndex: 0,
    questionIndex: 0,
  },
  params: {},
  userAnswers: {},
  slideMoveDirection: DEFAULT_MOVE_DIRECTION,
};

export const reducer = (state: IState = initialState, action: IAction) => {
  switch (action.type) {
    case SET_NEW_DATA: {
      return { ...state, data: action.payload };
    }

    case CHANGE_CURRENT_LOCATION: {
      return {
        ...state,
        location: action.payload.location,
        slideMoveDirection: action.payload.slideMoveDirection,
      };
    }

    case SET_USER_ANSWER: {
      const docID = action.payload.docID;
      const value = action.payload.value;
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [docID]: value,
        },
      };
    }

    default: {
      return { ...state };
    }
  }
};
