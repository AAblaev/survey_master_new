import { css } from "@emotion/react";
import { DEFAULT_BACKGROUND_COLOR, PRIMARY_COLOR } from "./consts/const";

export const desctopCss = css`
  background-color: ${DEFAULT_BACKGROUND_COLOR};
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  align-items: center;
`;

export const contentCss = css`
  flex: 1 0 auto;
  width: 100%;
  margin-top: 56px;
  margin-bottom: 56px;
  height: calc(100% - 112px);

  @media (min-width: 768px) {
    margin-top: 64px;
    margin-bottom: 0px;
    height: calc(100% - 64px);
  }
`;

export const homeButtonCss = css`
  background-color: #3b424a;
  &.MuiButton-root {
    display: flex;
    justify-content: space-between;
    color: #fff;
    // min-width: 80px;
  }
`;

export const onlyDesctopButtonCss = css`
  &.MuiButtonBase-root {
    display: none;
  }

  @media (min-width: 768px) {
    &.MuiButtonBase-root {
      display: inline-flex;
    }
  }
`;

export const transitionGroupCss = css`
  // padding-bottom: 40px;
  & > div {
    box-sizing: border-box;
  }
`;

export const modalHeaderWrapperCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const gridContainerCss = css`
  flex-grow: 1;
  position: relative;
  display: grid;
  grid-template-columns: 5% auto 5%;
  grid-template-rows: auto;

  @media (min-width: 576px) {
    grid-template-columns: 5% auto 5%;
  }

  @media (min-width: 768px) {
    grid-template-columns: 10% auto 10%;
  }

  @media (min-width: 992px) {
    grid-template-columns: 15% auto 15%;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 20% auto 20%;
  }
`;

export const borderCss = css`
  background-color: ${DEFAULT_BACKGROUND_COLOR};
  z-index: 20;
`;

export const footerCss = css`
  width: 100%;
  height: 56px;
  background-color: ${PRIMARY_COLOR};
  position: fixed;
  top: auto;
  bottom: 0;
  left: 0;
  right: auto;
  z-index: 3000;
  @media (min-width: 768px) {
    display: none;
  }
`;
