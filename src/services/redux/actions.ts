import { IParsedData, IState } from "../../types";
import { SET_NEW_DATA, SET_NEW_STATE } from "./types";

export const setNewState = (payload: IState) =>
  <const>{
    type: SET_NEW_STATE,
    payload,
  };

export const setNewData = (payload: IParsedData) =>
  <const>{
    type: SET_NEW_DATA,
    payload,
  };
