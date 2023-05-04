import React from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { IState } from "../../types";

import { css } from "@emotion/react";
import { Typography } from "@material-ui/core";

export type IPage = ConnectedProps<typeof connector>;

export const pageCss = css`
  padding-right: 40px;
  padding-left: 40px;
  background-color: #fff;
`;

const Page: React.FC<IPage> = ({ page, pageIndex }) => {
  console.log("page", page);
  const title = page.title ? page.title : `Страница ${pageIndex + 1}`;
  return (
    <div css={pageCss}>
      <Typography>{title}</Typography>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const { location, data } = state;
  const emptyData = !Boolean(data);
  const pages = data ? data.pages : [];
  const { pageIndex } = location;
  const currentPage = pages[pageIndex];

  return {
    page: currentPage,
    pageIndex,
  };
};

const connector = connect(mapStateToProps);

export default connector(Page);
