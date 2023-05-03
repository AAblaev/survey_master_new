import { IData, ILocation, ISlideMoveDirection, IState } from "../../types";
import { SET_NEW_DATA, SET_NEW_STATE, CHANGE_CURRENT_LOCATION } from "./types";

export const setNewState = (payload: IState) =>
  <const>{
    type: SET_NEW_STATE,
    payload,
  };

export const setNewData = (payload: IData) =>
  <const>{
    type: SET_NEW_DATA,
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
