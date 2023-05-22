import { css } from "@emotion/react";

export const freeQuestionCss = css`
  width: 100%;
  & .MuiFormLabel-root {
    color: #000000;
    font-size: 1.3rem;
    font-weight: 300;
  }

  & .MuiInputLabel-root {
    color: #46acaf;
    &.Mui-focused {
      color: #46acaf;
    }
  }

  & .MuiFilledInput-root {
    font-size: 1.3rem;
    border: 1px solid #46acaf;
    background-color: #fcfcfb;
    border-radius: 4px;
  }
  & .MuiFilledInput-root.Mui-focused {
    background-color: #fcfcfb;
    box-shadow: #46acaf;
    border-color: #46acaf;
  }
  & .MuiFilledInput-root:hover {
    background-color: transparent;
  }
`;

export const selectQuestionCss = css`
  & .MuiFormLabel-root {
    color: #000000;
    font-size: 1.3rem;
    font-weight: 300;
  }
`;
