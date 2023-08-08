import { css } from "@emotion/react";

export const formControlCss = css`
  width: 100%;
`;

export const renderValueCss = (isDefault: boolean) =>
  css`
    color: ${isDefault ? "#555" : "inherit"};
    padding: 0.5em;
  `;
