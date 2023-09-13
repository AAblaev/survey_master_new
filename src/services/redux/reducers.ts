import { DEFAULT_MOVE_DIRECTION } from "../../consts/const";
import { ILocation, IState } from "../../types";
import { pagesParser } from "../../utils/pagesParser";
import { sectionValidtion } from "../../utils/questionIsDone";
import {
  getNextLocation,
  getPrevLastLocation,
  ruleParser,
} from "../../utils/rule-utils";
import { answersParsed } from "../../utils/validation";
import { IAction } from "./actions.types";
import {
  CHANGE_CURRENT_LOCATION,
  SET_UID,
  SET_USER_ANSWER,
  IS_LOADING,
  IS_ERROR,
  TOGGLE_MODAL_VISIBLE,
  SET_VISITED_PAGE_DOCID,
  DELETE_USER_ANSWERS,
  SET_NEED_SCROLLING,
  SET_PATH,
  SET_SURVEY_ID,
  SET_DATA_AND_PARAMS,
  CONTINUE_PREV_SURVEY,
  START_NEW_SURVEY,
  CHANGE_CURRENT_PAGE,
  GO_TO_THE_NEXT_PAGE,
  GO_TO_THE_PREVIOUS_PAGE,
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
  needScrolling: false,
  visiblityRulesDict: {},
  pageTransitionRuleDict: {},
  disqualificationRuleArr: [],
  surveyCompletionRuleArr: [],
  pagesDict: {},
  pageMovementLogs: [],
};

export const reducer = (state: IState = initialState, action: IAction) => {
  // console.log(action.type);
  // console.log(state);

  switch (action.type) {
    case SET_DATA_AND_PARAMS: {
      const { data, params } = action.payload;
      const userAnswers = answersParsed(data.answers);
      const pagesDict = pagesParser(data.pages);
      const { visiblityRulesDict, pageTransitionRuleDict } = ruleParser(
        data.rules ? data.rules : []
      );

      return {
        ...state,
        params,
        data,
        userAnswers,
        visiblityRulesDict,
        pageTransitionRuleDict,
        pagesDict,
      };
    }

    case START_NEW_SURVEY: {
      const isShowPageList = state.data!.isShowPageList;
      const nextLocation: ILocation = {
        pathName: isShowPageList ? "survey" : "section",
        title: isShowPageList ? "survey" : "section",
        pageIndex: 0,
        questionIndex: 0,
      };

      const newPageMovementLogs = isShowPageList
        ? []
        : [String(state.data!.pages[0].docID)];
      return {
        ...state,
        params: {
          ...state.params,
          uid: action.payload,
        },
        userAnswers: [],
        location: nextLocation,
        slideMoveDirection: "right-to-left",
        pageMovementLogs: newPageMovementLogs,
      };
    }

    case CONTINUE_PREV_SURVEY: {
      const {
        disqualificationRuleArr,
        surveyCompletionRuleArr,
        userAnswers,
        pagesDict,
        pageTransitionRuleDict,
        data,
      } = state;
      const pages = data ? data.pages : [];
      const { location, pageMovementLogs } = getPrevLastLocation({
        disqualificationRuleArr,
        surveyCompletionRuleArr,
        userAnswers,
        pagesDict,
        pageTransitionRuleDict,
        pages,
      });

      return {
        ...state,
        location: location,
        slideMoveDirection: "right-to-left",
        needScrolling: true,
        pageMovementLogs,
      };
    }

    case GO_TO_THE_NEXT_PAGE: {
      const {
        location,
        data,
        visitedPageDocIDList,
        userAnswers,
        pagesDict,
        pageTransitionRuleDict,
      } = state;
      const { pageIndex } = location;
      const { pages } = data!;
      const currentPage = pages[pageIndex];
      const currentPageDocID = String(currentPage.docID);
      const newVisitedPageDocIDList = visitedPageDocIDList.includes(
        currentPageDocID
      )
        ? visitedPageDocIDList
        : [...visitedPageDocIDList, currentPageDocID];

      const resultSectionValidation = sectionValidtion(
        currentPage,
        userAnswers
      );
      if (resultSectionValidation) {
        const nextLocation = getNextLocation({
          currentLocation: location,
          pageCount: pages.length,
          pageTransitionRules: pageTransitionRuleDict[currentPageDocID],
          userAnswers,
          pagesDict,
        });
        const newPageMovementItem = String(pages[nextLocation.pageIndex].docID);

        return {
          ...state,
          location: nextLocation,
          slideMoveDirection: "right-to-left",
          visitedPageDocIDList: newVisitedPageDocIDList,
          pageMovementLogs: [...state.pageMovementLogs, newPageMovementItem],
        };
      }

      return { ...state, visitedPageDocIDList: newVisitedPageDocIDList };
    }

    case GO_TO_THE_PREVIOUS_PAGE: {
      const {
        location,
        data,
        visitedPageDocIDList,
        pagesDict,
        pageMovementLogs,
      } = state;
      const { pageIndex } = location;
      const { pages } = data!;
      const currentPage = pages[pageIndex];
      const currentPageDocID = String(currentPage.docID);
      const newVisitedPageDocIDList = visitedPageDocIDList.includes(
        currentPageDocID
      )
        ? visitedPageDocIDList
        : [...visitedPageDocIDList, currentPageDocID];
      const prevPageDocID =
        pageMovementLogs[pageMovementLogs.indexOf(currentPageDocID) - 1];
      const prevLocation = {
        ...location,
        pageIndex: pagesDict[prevPageDocID].order,
      };
      const newPageMovementLogs = state.pageMovementLogs.filter(
        (_v, i, arr) => i !== arr.length - 1
      );
      return {
        ...state,
        location: prevLocation,
        slideMoveDirection: "left-to-right",

        visitedPageDocIDList: newVisitedPageDocIDList,
        pageMovementLogs: newPageMovementLogs,
      };
    }

    case IS_LOADING: {
      return { ...state, loading: action.payload };
    }

    case IS_ERROR: {
      return { ...state, error: action.payload };
    }

    case SET_UID: {
      return {
        ...state,
        params: {
          ...state.params,
          uid: action.payload,
        },
      };
    }

    case SET_SURVEY_ID: {
      return {
        ...state,
        params: {
          ...state.params,
          surveyID: action.payload,
        },
      };
    }

    case SET_PATH: {
      return {
        ...state,
        params: {
          ...state.params,
          path: action.payload,
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

    case DELETE_USER_ANSWERS: {
      return {
        ...state,
        userAnswers: {},
      };
    }

    case SET_NEED_SCROLLING: {
      return {
        ...state,
        needScrolling: action.payload,
      };
    }

    default: {
      return { ...state };
    }
  }
};
