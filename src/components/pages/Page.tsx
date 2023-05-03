import React from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { IState } from "../../types";

import { css } from "@emotion/react";

export type IPage = ConnectedProps<typeof connector>;

export const pageCss = css`
  width: 100%;
  background-color: #fff;
  height: 50vh;
  text-align: center;
  font-size: 15em;
`;

const Page: React.FC<IPage> = () => {
  return <div css={pageCss}>Page</div>;
};

const mapStateToProps = (state: IState) => {
  return {
    state,
  };
};

const connector = connect(mapStateToProps);

export default connector(Page);
