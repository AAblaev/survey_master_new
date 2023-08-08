import { css } from "@emotion/react";
import { PRIMARY_COLOR } from "../../../../consts/const";

export const formControlCss = css`
  width: 100%;
`;

export const chipWrapperCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  padding-left: 0.5em;
`;
export const chipCss = (isDefault: boolean) => css`
  color: ${isDefault ? "#555" : "inherit"};
  background-color: ${isDefault ? "transparent" : "#e5e5e5"};
  padding: 0.5em;
  border-radius: 5px;
  overflow: hidden;
  white-space: normal;
`;

export const selectCss = css`
  & .MuiSelect-selectMenu {
    min-height: 2em;
  }
`;

export const iconCss = (selected: boolean) => css`
  &.MuiSvgIcon-root {
    margin-right: 5px;
    fill: ${PRIMARY_COLOR};
    ${!selected && "visibility:hidden"}
  }
`;

export const menuItemCss = css`
  &.MuiListItem-root.Mui-selected {
    background-color: transparent;
  }
  &.MuiMenuItem-root {
    white-space: normal;
  }
`;
