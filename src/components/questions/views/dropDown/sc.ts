import { css } from "@emotion/react";

export const formControlCss = css`
  width: 100%;
`;

export const renderValueCss = (isDefault: boolean) =>
  css`
    color: ${isDefault ? "#555" : "inherit"};
    padding: 0.5em;
  `;

export const textFieldCss = css`
  &.MuiFormControl-root {
    margin-top: 15px;
  }
  & .MuiFilledInput-multiline {
    padding: 10px;
  }
  & .PrivateNotchedOutline-root-7 {
    border-radius: 0;
  }
`;
