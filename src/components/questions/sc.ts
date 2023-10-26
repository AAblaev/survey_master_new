import { css } from "@emotion/react";

export const formControlCss = ({
  disabled,
  noBorderOnInput,
}: {
  disabled: boolean;
  noBorderOnInput: boolean;
}) => css`
  ${disabled && `filter: grayscale(100%)`};

  width: 100%;
  & .MuiFormLabel-root {
    // color: #000000;
    // font-size: 1.3rem;
    // font-weight: 300;
  }

  & .MuiInputLabel-root {
    color: #46acaf;
    &.Mui-focused {
      color: #46acaf;
    }
  }

  & .MuiFilledInput-root {
    // font-size: 1.3rem;
    border: ${noBorderOnInput ? 0 : 1}px solid #e5e5e5;
    // border: ${noBorderOnInput ? 0 : 1}px solid red;

    background-color: #fff;
    border-radius: 0px;
  }
  & .MuiFilledInput-root.Mui-focused {
    background-color: #fff;
    box-shadow: #46acaf;
    border-color: #e5e5e5;
  }
  & .MuiFilledInput-root:hover {
    background-color: transparent;
  }
  & .MuiFilledInput-inputHiddenLabel {
    padding: 5px;
  }
`;

export const cardCss = (needPadding: boolean) => css`
  ${needPadding && `padding: 20px;`}
  background-color: #fff;
  border: 1px solid #e5e5e5;
  overflow: hidden;
`;

export const commentCss = (disabled: boolean) => css`
  ${disabled && `pointer-events: none !important;`}
  ${disabled && `filter:grayscale(100%);`}
  & > * {
    ${disabled && `pointer-events: none !important;`}
  }
`;

export const testCss = css`
  &::before {
    counter-increment: section; /* Increment the value of section counter by 1 */
    content: "Section " counter(section) ": "; /* Display counter value in default style (decimal) */
  }
`;

export const titleCss = (disabled: boolean) => css`
  ${disabled && `filter: grayscale(100%)`};
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

export const titleCountCss = (brandColor: string) => css`
  font-size: 1.2rem;
  color: ${brandColor};
  font-weight: bold;
  &::before {
    counter-increment: section; /* Increment the value of section counter by 1 */
    content: "" counter(section) "."; /* Display counter value in default style (decimal) */
  }
`;

export const titleTextCss = (needCorrect: boolean) => css`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${needCorrect ? "red" : "#000000"};
  transition: color 0.3s ease;
`;

export const limitMessageWrapperCss = css`
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const limitMessageCss = css`
  font-size: 1rem;
  font-weight: 300;
  color: gray;
`;
