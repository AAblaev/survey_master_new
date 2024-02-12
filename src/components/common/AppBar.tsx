import React from "react";
import { AppBar as MaterialAppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";

import { css } from "@emotion/react";
import { PRIMARY_COLOR } from "../../consts/const";
import { IStyles } from "../../types";

export const toolbarCss = (
  direction: IAppBarDirection,
  color: string,
  fontSize: number,
  backgroundColor: string
) => css`
  display: flex;
  flex-direction: ${direction === "bottom" ? "row-reverse" : "row-reverse"};
  justify-content: ${direction === "bottom"
    ? "space-between"
    : "space-between"};

  padding-right: 5%;
  padding-left: 5%;

  color: ${color};
  font-size: ${fontSize}px;

  &.MuiToolbar-root {
    background: ${backgroundColor};
  }

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
    // background-color: #46acaf;
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
  appBarStyles: IStyles["componentsStyle"]["appBar"];
};

const AppBar: React.FC<IAppBarProps> = ({
  children,
  direction,
  fixed,
  appBarStyles,
}) => {
  return (
    <MaterialAppBar
      css={appBarCss(direction)}
      position={fixed ? "fixed" : "static"}
    >
      <Toolbar
        css={toolbarCss(
          direction,
          appBarStyles.font.color,
          appBarStyles.font.size,
          appBarStyles.background.color
        )}
      >
        {children}
      </Toolbar>
    </MaterialAppBar>
  );
};

export default AppBar;
