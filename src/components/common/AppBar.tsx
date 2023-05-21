import React from "react";
import { AppBar as MaterialAppBar } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";

import { css } from "@emotion/react";

export const toolbarCss = (direction: IAppBarDirection) => css`
  display: flex;
  flex-direction: ${direction === "bottom" ? "row-reverse" : "row"};
  justify-content: space-between;
  background-color: #46acaf;
`;

export const bottomCss = css`
  // padding-left: 20%;
  &.MuiAppBar-positionFixed {
    top: auto;
    bottom: 0;
    left: 0;
    right: auto;
    background-color: #46acaf;
  }
`;

export const appBarCss = (direction: IAppBarDirection) => css`
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
