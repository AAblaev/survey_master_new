import { css } from "@emotion/react";
import { DEFAULT_BACKGROUND_COLOR, PRIMARY_COLOR } from "./consts/const";

export const desctopCss = (backgroundColor: string) => css`
  background-color: ${backgroundColor};
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
  // background-color: #3b424a;
  &.MuiButton-root {
    display: flex;
    justify-content: space-between;
    white-space: nowrap;
    font-size: inherit;
  }
`;

export const surveyNameCss = (showAnyway: boolean) => css`
  display: ${showAnyway ? "block" : "none"};
  text-transform: uppercase;

  &.MuiTypography-body1 {
    font-weight: 600;
    font-size: inherit;
  }

  &.MuiTypography-root {
    margin-right: auto;
  }
  @media (min-width: 768px) {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  grid-template-columns: 5% 90% 5%;
  grid-template-rows: auto;
  margin-top: 10px;

  @media (min-width: 576px) {
    grid-template-columns: 5% 90% 5%;
  }

  @media (min-width: 768px) {
    grid-template-columns: 10% 80% 10%;
  }

  @media (min-width: 992px) {
    grid-template-columns: 15% 70% 15%;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 20% 60% 20%;
  }
`;

export const borderCss = (backgroundColor: string) => css`
  background-color: ${backgroundColor};
  z-index: 20;
`;

export const footerCss = (brandColor: string) => css`
  width: 100%;
  height: 56px;
  background-color: ${brandColor};
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

export const progressQuestionCountCss = (
  fontSize: number,
  color: string
) => css`
  margin-top: 10px;
  font-size: ${fontSize}px;
  font-weight: 500;
  color: ${color};
`;
