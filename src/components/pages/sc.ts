import { css } from "@emotion/react";
import { PRIMARY_COLOR } from "../../consts/const";

export const greatingPageCss = css`
  padding-top: 20px;
`;

export const buttonsWrapperCss = css`
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
`;

export const questionListCss = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
`;

export const titleCss = css`
  &.MuiTypography-body1 {
    font-size: 1.2rem;
    color: ${PRIMARY_COLOR};
    font-weight: bold;
  }
`;

export const pageCss = css`
  @media (max-width: 576px) {
    padding-right: 0%;
    padding-left: 0%;
  }
`;

export const accordionCss = css`
  width: 100%;
  & .MuiAccordionSummary-content {
    align-items: center;
    gap: 20px;
  }

  & .MuiAccordionDetails-root {
    display: flex;
    justify-content: space-between;
  }
`;
