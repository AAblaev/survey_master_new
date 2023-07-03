import React from "react";
import { AppBar as MaterialAppBar } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";

import { css } from "@emotion/react";
import { PRIMARY_COLOR } from "../../consts/const";

export const toolbarCss = (direction: IAppBarDirection) => css`
  display: flex;
  flex-direction: ${direction === "bottom" ? "row-reverse" : "row"};
  justify-content: space-between;
  background-color: ${PRIMARY_COLOR};

  padding-right: 5%;
  padding-left: 5%;

  @media (min-width: 576px) {
    &.MuiToolbar-gutters {
      padding-right: 5%;
      padding-left: 5%;
    }
  }

  @media (min-width: 768px) {
    &.MuiToolbar-gutters {
      padding-right: 10%;
      padding-left: 10%;
    }
  }

  @media (min-width: 992px) {
    &.MuiToolbar-gutters {
      padding-right: 15%;
      padding-left: 15%;
    }
  }

  @media (min-width: 1200px) {
    &.MuiToolbar-gutters {
      padding-right: 20%;
      padding-left: 20%;
    }
  }
`;

export const bottomCss = css`
  &.MuiAppBar-root {
    display: flex;
  }
  @media (min-width: 768px) {
    &.MuiAppBar-root {
      display: none;
    }
  }

  &.MuiAppBar-positionFixed {
    top: auto;
    bottom: 0;
    left: 0;
    right: auto;
    background-color: #46acaf;
  }
`;

export const appBarCss = (direction: IAppBarDirection) => css`
  &.MuiAppBar-root {
    z-index: 6000;
  }
  ${direction === "bottom" && bottomCss}
`;

type IAppBarDirection = "top" | "bottom";

type IAppBarProps = {
  // children?: ReactNode;
  fixed?: boolean;
  direction: IAppBarDirection;
};

const AppBar: React.FC<IAppBarProps> = ({ children, direction, fixed }) => {
  return (
    <MaterialAppBar
      css={appBarCss(direction)}
      position={fixed ? "fixed" : "static"}
    >
      <Toolbar css={toolbarCss(direction)}>{children}</Toolbar>
    </MaterialAppBar>
  );
};

export default AppBar;
