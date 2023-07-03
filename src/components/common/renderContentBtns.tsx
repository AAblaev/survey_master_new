import React from "react";
import { css } from "@emotion/react";
import { ILocation, ISlideMoveDirection } from "../../types";
import getPrevAndNextLocation from "../../utils/getPrevAndNextLocation";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { DEFAULT_BACKGROUND_COLOR } from "../../consts/const";

const iconBtnCss = (side: "left" | "right") => css`
  &.MuiButtonBase-root {
    display: none;
    position: absolute;
    top: 47%;
    z-index: 2000;
  }

  & .MuiSvgIcon-fontSizeLarge {
    font-size: 50px;
  }

  @media (min-width: 768px) {
    &.MuiButtonBase-root {
      display: inline-flex;
      ${side === "left" && "left: 1%;"}
      ${side === "right" && "right: 1%;"}
      ${side === "left" && "transform: rotate(180deg);"}
    }
  }

  @media (min-width: 992px) {
    &.MuiButtonBase-root {
      display: inline-flex;
      ${side === "left" && "left: 5%;"}
      ${side === "right" && "right: 5%;"}
      ${side === "left" && "transform: rotate(180deg);"}
    }
  }
  @media (min-width: 1200px) {
    &.MuiButtonBase-root {
      display: inline-flex;
      ${side === "left" && "left: 8%;"}
      ${side === "right" && "right: 8%;"}
      ${side === "left" && "transform: rotate(180deg);"}
    }
  }

`;

export const buttonWrapper = (side: "left" | "right") => css`
  display: none;
  background-color: ${DEFAULT_BACKGROUND_COLOR};
  height: calc(100% - 56px);
  position: fixed;
  ${side === "left" && "left: 0;"}
  ${side === "right" && "right: 0;"}
  z-index: 2000;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    display: flex;
    width: 9%;
  }

  @media (min-width: 992px) {
    display: flex;
    width: 14%;
  }

  @media (min-width: 1200px) {
    display: flex;
    width: 19%;
  }
`;

type IBtnRenderProps = {
  location: ILocation;
  buttonStartCaption: string;
  buttonNextCaption: string;
  buttonBackCaption: string;
  buttonFinishCaption: string;
  handleClick: (payload: {
    location: ILocation;
    slideMoveDirection: ISlideMoveDirection;
    needSendAnswers: boolean;
  }) => void;
  completeSurvey: () => void;
  startSurvey: () => void;
  pagesCount: number;
  isShowPageList: boolean;
};

const contentBtnRender = ({
  location,
  buttonStartCaption,
  buttonNextCaption,
  buttonBackCaption,
  buttonFinishCaption,
  handleClick,
  completeSurvey,
  pagesCount,
  startSurvey,
  isShowPageList,
}: IBtnRenderProps) => {
  const [prevLocation, nextLocation] = getPrevAndNextLocation(location);
  switch (location.pathName) {
    case "greeting": {
      return [];
    }
    case "survey": {
      return [
        <IconButton
          key="IconButton1"
          css={iconBtnCss("right")}
          onClick={() =>
            handleClick({
              location: {
                pageIndex: 0,
                questionIndex: 0,
                pathName: "section",
                title: "section",
              },
              slideMoveDirection: "right-to-left",
              needSendAnswers: false,
            })
          }
        >
          <ChevronRightIcon fontSize="large" />
        </IconButton>,
        <IconButton
          key="IconButton2"
          css={iconBtnCss("left")}
          disabled
          onClick={() =>
            handleClick({
              location: prevLocation,
              slideMoveDirection: "left-to-right",
              needSendAnswers: true,
            })
          }
        >
          <ChevronRightIcon fontSize="large" />
        </IconButton>,
      ];
    }
    case "section": {
      return [
        <IconButton
          key="IconButton1"
          css={iconBtnCss("right")}
          disabled={nextLocation.pageIndex === pagesCount}
          onClick={() => {
            handleClick({
              location: nextLocation,
              slideMoveDirection: "right-to-left",
              needSendAnswers: true,
            });
          }}
        >
          <ChevronRightIcon fontSize="large" />
        </IconButton>,
        <IconButton
          key="IconButton2"
          css={iconBtnCss("left")}
          disabled={!isShowPageList && prevLocation.pathName === "survey"}
          onClick={() =>
            handleClick({
              location: prevLocation,
              slideMoveDirection: "left-to-right",
              needSendAnswers: true,
            })
          }
        >
          <ChevronRightIcon fontSize="large" />
        </IconButton>,
      ];
    }
  }
  return null;
};

export default contentBtnRender;
