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

  & .MuiInputLabel-root {
    color: #46acaf;
    &.Mui-focused {
      color: #46acaf;
    }
  }

  & .MuiFilledInput-root {
    // font-size: 1.3rem;
    border: ${noBorderOnInput ? 0 : 1}px solid #e5e5e5;

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

export const cardCss = (
  needPadding: boolean,
  borderColor: string,
  borderSize: number
) => css`
  ${needPadding && `padding: 20px;`}
  background-color: #fff;
  border: ${borderSize}px solid ${borderColor};
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

export const titleCountCss = (brandColor: string, fontSize: number) => css`
  font-size: ${fontSize}px;
  color: ${brandColor};
  font-weight: bold;
  &::before {
    counter-increment: section; /* Increment the value of section counter by 1 */
    content: "" counter(section) "."; /* Display counter value in default style (decimal) */
  }
`;

export const titleTextCss = (
  needCorrect: boolean,
  color: string,
  fontSize: number
) => css`
  font-size: ${fontSize}px;
  //font-size:1.2em;
  font-weight: 500;
  color: ${needCorrect ? "red" : color};
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
