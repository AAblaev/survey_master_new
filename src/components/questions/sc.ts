import { css } from "@emotion/react";
import { PRIMARY_COLOR } from "../../consts/const";

export const formControlCss = (disabled: boolean) => css`
  ${disabled && `filter: grayscale(100%)`};

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

export const cardCss = (needPadding: boolean) => css`
  ${needPadding && `padding: 20px;`}
  background-color: #fff;
  border: 1px solid #bdbdbd;
`;
export const titleCss = (disabled: boolean) => css`
  ${disabled && `filter: grayscale(100%)`};

  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;
export const titleCountCss = css`
  font-size: 1.2rem;
  color: ${PRIMARY_COLOR};
  font-weight: bold;
`;

export const titleTextCss = css`
  font-size: 1.2rem;
`;

export const selectQuestionCss = css`
  & .MuiFormLabel-root {
    color: #000000;
    font-size: 1.3rem;
    font-weight: 300;
  }
`;
