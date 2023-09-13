import {
  IAnswer,
  IData,
  ILocation,
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
} from "./types";

export const setNewState = (payload: IState) =>
  <const>{
    type: SET_NEW_STATE,
    payload,
  };

export const setDataAndParams = (payload: { data: IData; params: IParams }) =>
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
