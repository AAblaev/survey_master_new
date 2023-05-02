import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { css } from "@emotion/react";
import "./assets/index.css";

function Desktop() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "FETCH_SURVEY_DATA" });
  }, []);
  return <div>ghbdtn</div>;
}

export default Desktop;
