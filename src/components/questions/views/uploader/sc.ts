import { css } from "@emotion/react";
import chroma from "chroma-js";

export const ddAreaCss = (color: string, isOverArea: boolean) => css`
  border: 2px dashed ${color};
  background: ${isOverArea ? chroma(color).alpha(0.1).css() : "#fff"};
  padding: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const visuallyHiddenInputCss = css`
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  width: 1;
  height: 1;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
`;

export const listItemCss = css`
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid grey;
`;

export const listItemStartIconCss = css`
  min-width: 35px;
`;

export const listItemEndIconCss = css`
  flex-direction: row-reverse;
`;

export const messageWrapperCss = css`
  margin-top: 5px;
  margin-bottom: 20px;
  position: relative;
`;

export const messageCss = css`
  font-size: 1rem;
  font-weight: 300;
  color: gray;
`;

export const areaTextCss = css`
  @media screen and (max-width: 767px) {
    &::after {
      content: "Выберите файлы";
      color: black;
    }
  }

  @media screen and (min-width: 768px) {
    &::after {
      content: "Перетащите файлы или выберите на компьютере";
      color: black;
    }
  }
`;
