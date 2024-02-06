import {
  GREETING_PAGE_LOCATION,
  DEFAULT_MOVE_DIRECTION,
  PAGE_LIST_LOCATION,
  FIRST_PAGE_LOCATION,
  DEFAULT_STYLES,
} from "../../consts/const";
import { ILocation, IState } from "../../types";
// import {
//   fakePageTransitionRules,
//   fakeRules,
//   fakeRules2,
//   fakeMatrixData,
// } from "../../utils/fakeData";
import { pagesParser } from "../../utils/pagesParser";
import {
  getLogicalValidityCheckRulesByQuestionID,
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
  CANCEL_TRANSITION,
  SURVEY_COMPLETION_RULE_ACTIVE,
  SELECT_SECTION,
  UPDATE_LOGICAL_RULES_STATUS,
  APPROVE_LOGIC_RULE_STATUS,
  SET_FIRST_LOCATION_WITH_DEVIATION,
  SET_ALL_PAGES_VISITED,
  CANCEL_COMPLETION,
  GO_TO_FIRST_DEVIATION_PAGE,
} from "./types";

const initialState: IState = {
  loading: false,
  error: { message: "", status: false },
  modalVisible: false,
  modalMessage: {
    code: 101,
    type: "greeting",
  },
  data: null,
  location: GREETING_PAGE_LOCATION,
  firstLocationWithDeviation: GREETING_PAGE_LOCATION,
  params: {},
  userAnswers: {},
  slideMoveDirection: DEFAULT_MOVE_DIRECTION,
  visitedPageDocIDList: [],
  needScrolling: false,
  visiblityRulesDict: {},
  pageTransitionRuleDict: {},
  logicalValidityCheckRuleDict: {},
  dependentQuestionsDict: {},
  dependentPagesDict: {},
  targetPageTransitionRuleArr: [],
  disqualificationRuleArr: [],
  surveyCompletionRuleArr: [],
  pagesDict: {},
  pageMovementLogs: [],
  strictModeNavigation: false,
  styles: DEFAULT_STYLES,
};

export const reducer = (state: IState = initialState, action: IAction) => {
  // console.log(action.type);
  // console.log(state);

  switch (action.type) {
    case SET_DATA_AND_PARAMS: {
      const { data, params, notTheFirstTime } = action.payload;
      // const { params, notTheFirstTime } = action.payload;
      // const data = fakeMatrixData;

      const {
        pages,
        answers,
        rules,
        isShowPageList,
        isShowGreetingsPage,
        isShowButtonBack,
        colorScheme,
      } = data;

      const userAnswers = answersParsed(answers);
      const pagesDict = pagesParser(pages);

      const {
        visiblityRulesDict,
        pageTransitionRuleDict,
        disqualificationRuleArr,
        logicalValidityCheckRuleDict,
        surveyCompletionRuleArr,
        targetPageTransitionRuleArr,
      } = ruleParser(rules);

      const {
        dependentQuestionsDict,
        dependentPagesDict,
      } = getLogicalValidityCheckRulesByQuestionID(
        Object.values(logicalValidityCheckRuleDict).map(
          (item) => item.logicRule
        )
      );

      // console.log("dependentPagesDict", dependentPagesDict);

      const strictModeNavigation =
        !isShowButtonBack ||
        !isShowPageList ||
        Object.keys(pageTransitionRuleDict).length > 0 ||
        surveyCompletionRuleArr.length > 0;
      // const styles = DEFAULT_STYLES;

      // console.log("strictModeNavigation", strictModeNavigation);

      const styles = colorScheme.jsonStyle;

      if (notTheFirstTime) {
        const { location, pageMovementLogs } = getPrevLastLocation({
          disqualificationRuleArr,
          surveyCompletionRuleArr,
          userAnswers,
          pagesDict,
          pageTransitionRuleDict,
          pages,
          targetPageTransitionRuleArr,
        });

        return {
          ...state,
          params,
          data,
          userAnswers,
          visiblityRulesDict,
          pageTransitionRuleDict,
          disqualificationRuleArr,
          logicalValidityCheckRuleDict,
          dependentQuestionsDict,
          dependentPagesDict,
          surveyCompletionRuleArr,
          pagesDict,
          strictModeNavigation,
          targetPageTransitionRuleArr,
          location: location,
          slideMoveDirection: "right-to-left",
          needScrolling: true,
          pageMovementLogs,
          // visitedPageDocIDList: pageMovementLogs,
          modalVisible: true,
          styles,
        };
      }

      const location = isShowGreetingsPage
        ? GREETING_PAGE_LOCATION
        : isShowPageList
        ? PAGE_LIST_LOCATION
        : FIRST_PAGE_LOCATION;

      return {
        ...state,
        params,
        data,
        userAnswers,
        visiblityRulesDict,
        pageTransitionRuleDict,
        disqualificationRuleArr,
        logicalValidityCheckRuleDict,
        dependentQuestionsDict,
        dependentPagesDict,
        surveyCompletionRuleArr,
        pagesDict,
        strictModeNavigation,
        targetPageTransitionRuleArr,
        location: location,
        styles,
      };
    }

    case START_NEW_SURVEY: {
      const isShowPageList = state.data!.isShowPageList;
      const isShowButtonBack = state.data!.isShowButtonBack;
      const strictModeNavigation = state.strictModeNavigation;
      const firtPageIsSurvey =
        isShowPageList && isShowButtonBack && !strictModeNavigation;

      const nextLocation: ILocation = {
        pathName: firtPageIsSurvey ? "survey" : "section",
        title: firtPageIsSurvey ? "survey" : "section",
        pageIndex: 0,
        questionIndex: 0,
      };

      const slideMoveDirection =
        state.location.pathName === "greeting"
          ? "right-to-left"
          : "left-to-right";
      const newPageMovementLogs = firtPageIsSurvey
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
        slideMoveDirection: slideMoveDirection,
        pageMovementLogs: newPageMovementLogs,
      };
    }

    case CONTINUE_PREV_SURVEY: {
      return {
        ...state,
        modalVisible: false,
      };
    }

    case GO_TO_THE_NEXT_PAGE: {
      const {
        location,
        pageTransitionRuleDict,
        data,
        pageMovementLogs,
        pagesDict,
        userAnswers,
        targetPageTransitionRuleArr,
        visitedPageDocIDList,
        strictModeNavigation,
      } = state;
      const pages = data!.pages;
      const { pageIndex } = location;
      const currentPage = pages[pageIndex];
      const currentPageDocID = String(currentPage.docID);

      const { direction, targetPageID } = action.payload;
      // console.log("targetPageID", targetPageID);
      // console.log("targetPageID", Boolean(targetPageID));
      // console.log("targetPageID", targetPageID === undefined);
      // console.log("targetPageID", typeof targetPageID);

      if (!strictModeNavigation) {
        const nextPageIndex = targetPageID
          ? pagesDict[targetPageID].order
          : location.pageIndex + 1;

        if (nextPageIndex === pages.length) {
          return {
            ...state,
            visitedPageDocIDList: [...visitedPageDocIDList, currentPageDocID],
            modalVisible: true,
            modalMessageType: "completion",
          };
        }
        const newPageMovementLogs = pages
          .map((page) => page.docID)
          .slice(0, nextPageIndex + 1);

        const nextLocation: ILocation = {
          pathName: "section",
          title: "section",
          pageIndex: nextPageIndex,
          questionIndex: 0,
        };
        return {
          ...state,
          location: nextLocation,
          slideMoveDirection: direction,
          pageMovementLogs: newPageMovementLogs,
        };
      }

      const nextLocation = getNextLocation({
        currentLocation: location,
        pageCount: pages.length,
        pageTransitionRules: pageTransitionRuleDict[currentPageDocID],
        userAnswers,
        pagesDict,
        pageMovementLogs,
        pages,
        targetPageTransitionRuleArr,
      });

      const newVisitedPageDocIDList = visitedPageDocIDList.includes(
        currentPageDocID
      )
        ? visitedPageDocIDList
        : [...visitedPageDocIDList, currentPageDocID];
      // const newVisitedPageDocIDList = [
      //   ...visitedPageDocIDList,
      //   currentPageDocID,
      // ];

      if (nextLocation.pathName === "completion") {
        // console.log("completion");
        return {
          ...state,
          visitedPageDocIDList: newVisitedPageDocIDList,
          modalVisible: true,
          modalMessage: { code: 301, type: "complete" },
        };
      }

      const newPageMovementLogs = [
        ...pageMovementLogs,
        String(pages[nextLocation.pageIndex].docID),
      ];

      return {
        ...state,
        location: nextLocation,
        pageMovementLogs: newPageMovementLogs,
        visitedPageDocIDList: newVisitedPageDocIDList,
        slideMoveDirection: direction,
      };
    }

    case GO_TO_THE_PREVIOUS_PAGE: {
      const {
        location,
        data,
        pageMovementLogs,
        pagesDict,
        strictModeNavigation,
      } = state;
      const { targetPageID, direction } = action.payload;
      const pages = data!.pages;
      if (!strictModeNavigation) {
        const prevPageIndex = targetPageID
          ? pagesDict[targetPageID].order
          : location.pageIndex - 1;

        const pathName = prevPageIndex < 0 ? "survey" : "section";
        const title = prevPageIndex < 0 ? "survey" : "section";

        const prevLocation: ILocation = {
          pathName: pathName,
          title: title,
          pageIndex: prevPageIndex < 0 ? 0 : prevPageIndex,
          questionIndex: 0,
        };
        const newPageMovementLogs = pages
          .map((page) => page.docID)
          .slice(0, prevPageIndex + 1);

        return {
          ...state,
          location: prevLocation,
          slideMoveDirection: direction,
          pageMovementLogs: newPageMovementLogs,
        };
      }

      const { pageIndex } = location;
      const currentPage = pages[pageIndex];
      const currentPageDocID = String(currentPage.docID);

      const prevPageDocID = targetPageID
        ? targetPageID
        : pageMovementLogs[pageMovementLogs.indexOf(currentPageDocID) - 1];

      const prevLocation = {
        pathName: "section",
        title: "section",
        slideMoveDirection: direction,
        pageIndex: pagesDict[prevPageDocID].order,
        questionIndex: 0,
      };

      const prevIndexInLogs = pageMovementLogs.indexOf(prevPageDocID);
      const newPageMovementLogs = pageMovementLogs.filter(
        (_v, i) => !(i > prevIndexInLogs)
      );

      return {
        ...state,
        location: prevLocation,
        slideMoveDirection: direction,
        pageMovementLogs: newPageMovementLogs,
      };
    }

    case SELECT_SECTION: {
      const { pageDocID } = action.payload;
      const {
        pageMovementLogs,
        strictModeNavigation,
        pagesDict,
        location,
        data,
      } = state;

      const pages = data!.pages;
      const newLocation = {
        pathName: "section",
        title: "section",
        pageIndex: pagesDict[pageDocID].order,
        questionIndex: 0,
      };

      if (!strictModeNavigation) {
        const slideMoveDirection =
          pagesDict[pageDocID].order < location.pageIndex
            ? "left-to-right"
            : "right-to-left";
        const newPageMovementLogs = pages
          .map((page) => page.docID)
          .slice(0, pagesDict[pageDocID].order + 1);
        return {
          ...state,
          location: newLocation,
          slideMoveDirection,
          pageMovementLogs: newPageMovementLogs,
        };
      }

      const newPageMovementLogs = [];
      for (const docID of pageMovementLogs) {
        newPageMovementLogs.push(docID);

        if (pageDocID === docID) {
          break;
        }
      }

      return {
        ...state,
        location: newLocation,
        slideMoveDirection: "left-to-right",
        pageMovementLogs: newPageMovementLogs,
      };
    }

    case CHANGE_CURRENT_PAGE: {
      return { ...state, ...action.payload };
    }
    case GO_TO_FIRST_DEVIATION_PAGE: {
      const { firstLocationWithDeviation } = state;
      return {
        ...state,
        location: firstLocationWithDeviation,
        // needScrolling: true,
        slideMoveDirection: "left-to-right",
        modalVisible: false,
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

    case SET_FIRST_LOCATION_WITH_DEVIATION: {
      return {
        ...state,
        firstLocationWithDeviation: action.payload.location,
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

    case CANCEL_TRANSITION: {
      const { currentPageDocID, modalMessage } = action.payload;

      return {
        ...state,
        visitedPageDocIDList: state.visitedPageDocIDList.includes(
          currentPageDocID
        )
          ? state.visitedPageDocIDList
          : [...state.visitedPageDocIDList, currentPageDocID],
        modalVisible: true,
        modalMessage: modalMessage,
      };
    }

    case SURVEY_COMPLETION_RULE_ACTIVE: {
      const { currentPageDocID } = action.payload;

      return {
        ...state,
        visitedPageDocIDList: state.visitedPageDocIDList.includes(
          currentPageDocID
        )
          ? state.visitedPageDocIDList
          : [...state.visitedPageDocIDList, currentPageDocID],
        modalVisible: true,
        modalMessageType: "completion",
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

    case SET_ALL_PAGES_VISITED: {
      const { data } = state;
      const { pages } = data!;
      const new_visitedPageDocIDList = pages.map((page) => String(page.docID));
      return { ...state, visitedPageDocIDList: new_visitedPageDocIDList };
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

    case UPDATE_LOGICAL_RULES_STATUS: {
      const newValues = action.payload.values;
      return {
        ...state,
        logicalValidityCheckRuleDict: {
          ...state.logicalValidityCheckRuleDict,
          ...newValues,
        },
      };
    }

    case APPROVE_LOGIC_RULE_STATUS: {
      const key = action.payload.ruleDocID;
      const newValue = {
        ...state.logicalValidityCheckRuleDict[key],
        status: true,
      };
      return {
        ...state,
        logicalValidityCheckRuleDict: {
          ...state.logicalValidityCheckRuleDict,
          [key]: newValue,
        },
      };
    }

    case CANCEL_COMPLETION: {
      const { location, modalMessage } = action.payload;
      const { data } = state;
      const { pages } = data!;
      const new_visitedPageDocIDList = pages.map((page) => String(page.docID));

      return {
        ...state,
        visitedPageDocIDList: new_visitedPageDocIDList,
        firstLocationWithDeviation: location,
        modalVisible: true,
        modalMessage: modalMessage,
      };
    }
    default: {
      return { ...state };
    }
  }
};
