import { IState } from "../../types";
import { IAction } from "./actions.types";
import { SET_NEW_DATA } from "./types";

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
};

export const reducer = (state: IState = initialState, action: IAction) => {
  switch (action.type) {
    case SET_NEW_DATA: {
      return { ...state, data: action.payload };
    }
    default: {
      return { ...state };
    }
  }
};
