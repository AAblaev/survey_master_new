import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { css } from "@emotion/react";

type IProgressBarColor = "primary" | "secondary" | "inherit";

type IProgressBarPosition = "static" | "fixed" | "absolute";

type IProgressBarProps = {
  color?: IProgressBarColor;
  size?: number;
  position?: IProgressBarPosition;
  background?: string;
};

const rootCss = (position: IProgressBarPosition, background: string) => {
  const positionedExtraProps = css`
    top: 0;
    left: 0;
  `;
  return css`
    display: flex;
    z-index: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    position: ${position};
    background: ${background};
    ${position !== "static" && positionedExtraProps};
    & .MuiCircularProgress-colorPrimary {
      color: #46acaf;
    }
  `;
};

const ProgressBar: React.FC<IProgressBarProps> = ({
  color = "primary",
  size = 60,
  position = "static",
  background = "transparent",
}) => (
  <div css={rootCss(position, background)}>
    <CircularProgress disableShrink color={color} size={size} />
  </div>
);

export default ProgressBar;
