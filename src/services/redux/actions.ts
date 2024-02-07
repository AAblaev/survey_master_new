import {
  IAnswer,
  IData,
  ILocation,
  ILogicalValidityCheckRuleDict,
  IModalMessage,
  IParams,
  IQuestion,
  ISlideMoveDirection,
  IState,
} from "../../types";
import {
  SET_NEW_STATE,
  CHANGE_CURRENT_LOCATION,
  SET_USER_ANSWER,
  SET_UID,
  IS_LOADING,
  IS_ERROR,
  TOGGLE_MODAL_VISIBLE,
  SET_VISITED_PAGE_DOCID,
  VALIDATION,
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
  COMPLETE_SURVEY_BY_TIMER,
} from "./types";

export const setNewState = (payload: IState) =>
  <const>{
    type: SET_NEW_STATE,
    payload,
  };

export const setDataAndParams = (payload: {
  data: IData;
  params: IParams;
  notTheFirstTime: boolean;
}) =>
  <const>{
    type: SET_DATA_AND_PARAMS,
    payload,
  };

//
// export const setDataAndStartSurvey = (payload: {data:IData,}) =>
//   <const>{
//     type: SET_DATA_AND_START_SURVEY,
//     payload,
//   };

export const setLoading = (payload: boolean) =>
  <const>{
    type: IS_LOADING,
    payload,
  };

export const setError = (payload: { status: boolean; message: string }) =>
  <const>{
    type: IS_ERROR,
    payload,
  };

export const setSurveyUid = (payload: string) =>
  <const>{
    type: SET_UID,
    payload,
  };

export const setSurveyID = (payload: string) =>
  <const>{
    type: SET_SURVEY_ID,
    payload,
  };

export const setPath = (payload: string) =>
  <const>{
    type: SET_PATH,
    payload,
  };

export const changeCurretLocation = (payload: {
  location: ILocation;
  slideMoveDirection: ISlideMoveDirection;
}) =>
  <const>{
    type: CHANGE_CURRENT_LOCATION,
    payload,
  };

export const setAnswer = (payload: IAnswer) =>
  <const>{
    type: SET_USER_ANSWER,
    payload,
  };

export const toggleModalVoisible = (payload: boolean) =>
  <const>{
    type: TOGGLE_MODAL_VISIBLE,
    payload,
  };

export const setVisitedPageDocID = (payload: string) =>
  <const>{
    type: SET_VISITED_PAGE_DOCID,
    payload,
  };

export const validation = (payload: {
  question: IQuestion;
  optionID?: string;
}) =>
  <const>{
    type: VALIDATION,
    payload,
  };

export const deleteUserAnswers = () => <const>{ type: DELETE_USER_ANSWERS };

export const setNeedScrolling = (payload: boolean) =>
  <const>{
    type: SET_NEED_SCROLLING,
    payload,
  };

export const startNewSurvey = (payload: string) =>
  <const>{ type: START_NEW_SURVEY, payload };

export const continuePrevSurvey = () => <const>{ type: CONTINUE_PREV_SURVEY };

export const setCurrentPage = (payload: {
  slideMoveDirection: ISlideMoveDirection;
  location: ILocation;
  pageMovementLogs: string[];
  visitedPageDocIDList: string[];
}) => <const>{ type: CHANGE_CURRENT_PAGE, payload };

export const setFirstLocationWithDeviation = (payload: {
  location: ILocation;
}) => <const>{ type: SET_FIRST_LOCATION_WITH_DEVIATION, payload };

export const goToTheNextPage = (payload: {
  direction: ISlideMoveDirection;
  targetPageID: string | undefined;
}) => <const>{ type: GO_TO_THE_NEXT_PAGE, payload };

export const goToThePrevPage = (payload: {
  direction: ISlideMoveDirection;
  targetPageID: string | undefined;
}) => <const>{ type: GO_TO_THE_PREVIOUS_PAGE, payload };

export const cancelTransition = (payload: {
  currentPageDocID: string;
  modalMessage: IModalMessage;
}) => <const>{ type: CANCEL_TRANSITION, payload };

export const surveyCompletionRuleActive = (payload: {
  currentPageDocID: string;
}) => <const>{ type: SURVEY_COMPLETION_RULE_ACTIVE, payload };

export const selectSection = (payload: { pageDocID: string }) =>
  <const>{ type: SELECT_SECTION, payload };

export const updateLogicalRyleStatus = (payload: {
  values: ILogicalValidityCheckRuleDict;
}) => <const>{ type: UPDATE_LOGICAL_RULES_STATUS, payload };

export const approveLogicRuleStatus = (payload: { ruleDocID: string }) =>
  <const>{ type: APPROVE_LOGIC_RULE_STATUS, payload };

export const setAllPagesVisited = () => <const>{ type: SET_ALL_PAGES_VISITED };

export const cancelCompletion = (payload: {
  location: ILocation;
  modalMessage: IModalMessage;
}) => <const>{ type: CANCEL_COMPLETION, payload };
export const goToFirstDeviationPage = () =>
  <const>{ type: GO_TO_FIRST_DEVIATION_PAGE };

export const completeByTymer = () => <const>{ type: COMPLETE_SURVEY_BY_TIMER };
