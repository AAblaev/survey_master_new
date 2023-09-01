import { css } from "@emotion/react";
import { PRIMARY_COLOR } from "../../../../consts/const";

export const formControlCss = css`
  width: 100%;
`;

export const chipWrapperCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
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
  & .MuiOutlinedInput-input{
    padding:5px;
  }

  & .MuiSelect-selectMenu {
    min-height: 2.2em;
    display: flex;
    align-items: center;
    // background-color: ${PRIMARY_COLOR + 80};
  }
  & .PrivateNotchedOutline-root-7{
    border-radius:0;
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

export const textFieldCss = css`
  &.MuiFormControl-root {
    margin-top: 15px;
  }
  & .MuiFilledInput-multiline {
    padding: 10px;
  }
`;
