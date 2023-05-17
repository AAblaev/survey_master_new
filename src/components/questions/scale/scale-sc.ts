import { css } from "@emotion/react";

export const rootCss = css`
  & .MuiFormLabel-root {
    color: #000000;
    font-size: 1.3rem;
    font-weight: 300;
  }
`;

export const optionsCss = (horizontal: boolean) => css`
  display: flex;
  flex-direction: ${horizontal ? "row" : "column"};
  gap: 4px;
`;

export const optionCss = (selected: boolean) => css`
  border: 1px solid #ccc;
  padding: 1em;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${selected ? "#46acaf" : "transparent"};
  color: ${selected ? "#fff" : "inherit"};
  user-select: none;
`;
