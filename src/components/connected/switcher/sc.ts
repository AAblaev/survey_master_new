import { css } from "@emotion/react";

export const iconBtnCss = (side: "left" | "right") => css`
  &.MuiButtonBase-root {
    display: none;
    position: fixed;
    top: 47%;
    z-index: 2000;
  }

  & .MuiSvgIcon-fontSizeLarge {
    font-size: 50px;
  }

  @media (min-width: 768px) {
    &.MuiButtonBase-root {
      display: inline-flex;
      ${side === "left" && "left: 1%;"}
      ${side === "right" && "right: 1%;"}
      ${side === "left" && "transform: rotate(180deg);"}
    }
  }

  @media (min-width: 992px) {
    &.MuiButtonBase-root {
      display: inline-flex;
      ${side === "left" && "left: 5%;"}
      ${side === "right" && "right: 5%;"}
      ${side === "left" && "transform: rotate(180deg);"}
    }
  }
  @media (min-width: 1200px) {
    &.MuiButtonBase-root {
      display: inline-flex;
      ${side === "left" && "left: 8%;"}
      ${side === "right" && "right: 8%;"}
      ${side === "left" && "transform: rotate(180deg);"}
    }
  }

`;

export const buttonCss = (isShow: boolean, side: "left" | "right") => css`
  background-color: #3b424a;

  &.MuiButton-root {
    color: #fff;
  }
  &.MuiButtonBase-root {
    display: ${isShow ? "inline-flex" : "none"};
    position: fixed;
    bottom: 13px;
    ${side === "left" && "left: 4%;"}
    ${side === "right" && "right: 4%;"}
    z-index: 7000;
  }
  @media (min-width: 768px) {
    &.MuiButtonBase-root {
      display: none;
    }
  }
`;
