import React from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { IState } from "../../types";
import { Dispatch } from "redux";
import { css } from "@emotion/react";

export type ISurvey = ConnectedProps<typeof connector>;

export const pageCss = css`
  width: 100%;
  background-color: #fff;
  text-align: center;
  font-size: 15em;
`;

const Survey: React.FC<ISurvey> = () => {
  return (
    <div css={pageCss}>
      <div>Survey</div>
      <div>Survey</div>
      <div>Survey</div>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    state,
  };
};

const connector = connect(mapStateToProps);

export default connector(Survey);
