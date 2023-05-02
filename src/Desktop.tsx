import React, { useEffect } from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { css } from "@emotion/react";
import "./assets/index.css";
import { IState } from "./types";
import { Dispatch } from "redux";

export type IDesktop = ConnectedProps<typeof connector>;

const Desktop: React.FC<IDesktop> = ({ state }) => {
  const dispatch = useDispatch();
  console.log(state);
  useEffect(() => {
    dispatch({ type: "FETCH_SURVEY_DATA" });
  }, [dispatch]);
  return <div>ghbdtn</div>;
};

const mapStateToProps = (state: IState) => {
  return {
    state,
  };
};

const connector = connect(mapStateToProps);

export default connector(Desktop);
