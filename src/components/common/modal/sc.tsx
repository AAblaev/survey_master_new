import { css } from "@emotion/react";
import { alpha, Theme } from "@material-ui/core/styles";
import { DEFAULT_BACKGROUND_COLOR } from "../../../consts/const";
import { IModalSize } from "./modal.types";

export const container = ({
  size,
  shown,
}: {
  size?: IModalSize;
  shown: boolean;
}) => (theme: Theme) =>
  css`
    background: ${alpha(DEFAULT_BACKGROUND_COLOR, 0.6)};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    transition: all 0.2s;
    opacity: ${shown ? 1 : 0};
  `;

const dialogLg = css`
  width: 80%;
  height: 80%;
`;

const dialogMd = css`
  width: 50%;
  min-height: 40%;
  max-height: 80%;
`;

const dialogSm = css`
  width: 40%;
  min-height: 20%;
  max-height: 80%;
`;

const dialogFs = css`
  border-radius: 0px;
  box-shadow: none;
  width: 100%;
  height: 100%;
`;

const dialogMap = {
  lg: dialogLg,
  md: dialogMd,
  sm: dialogSm,
  fs: dialogFs,
};

export const dialog = ({
  size,
  shown,
}: {
  size?: IModalSize;
  shown: boolean;
}) => css`
  background-color: #fff;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0px 12px 40px rgba(0, 0, 0, 0.06),
    0px 3px 10px rgba(164, 164, 164, 0.03);
  overflow: hidden;
  transition: all 0.2s;
  transform: ${shown ? "scale(1)" : "scale(0.9)"};
  opacity: ${shown ? 1 : 0};
  ${size ? dialogMap[size] : dialogMap.md}
`;

export const header = css`
  padding: 30px;
  font-size: 22px;
  font-weight: 500;
`;

export const content = css`
  flex-grow: 1;
  overflow: auto;
  padding-left: 30px;
  padding-right: 30px;
  :first-of-type {
    padding-top: 30px;
  }
  :last-of-type {
    padding-bottom: 30px;
  }
`;

export const footer = css`
  padding: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  flex-wrap: wrap;
`;
