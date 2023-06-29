import React from "react";
import { css } from "@emotion/react";
import { ILocation, ISlideMoveDirection } from "../../types";
import getPrevAndNextLocation from "../../utils/getPrevAndNextLocation";
import Button from "@material-ui/core/Button";

export const buttonCss = (isShow: boolean) => css`
  background-color: #3b424a;
  &.MuiButton-root {
    color: #fff;
  }
  &.MuiButtonBase-root {
    display: ${isShow ? "inline-flex" : "none"};
  }
`;

type IBottomBtnRenderProps = {
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

const bottomBtnRender = ({
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
}: IBottomBtnRenderProps) => {
  const [prevLocation, nextLocation] = getPrevAndNextLocation(location);
  const showBackBtn = !(!isShowPageList && prevLocation.pathName === "survey");
  switch (location.pathName) {
    case "greeting": {
      return [
        <Button
          key="1"
          css={buttonCss(true)}
          onClick={() => {
            handleClick({
              location: {
                pageIndex: 0,
                questionIndex: 0,
                pathName: isShowPageList ? "survey" : "section",
                title: isShowPageList ? "survey" : "section",
              },
              slideMoveDirection: "right-to-left",
              needSendAnswers: false,
            });
            startSurvey();
          }}
        >
          {buttonStartCaption}
        </Button>,
      ];
    }
    case "survey": {
      return [
        <Button
          key="1"
          css={buttonCss(true)}
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
          {buttonNextCaption}
        </Button>,
      ];
    }
    case "section": {
      return [
        <Button
          key="1"
          css={buttonCss(true)}
          onClick={() => {
            nextLocation.pageIndex === pagesCount
              ? completeSurvey()
              : handleClick({
                  location: nextLocation,
                  slideMoveDirection: "right-to-left",
                  needSendAnswers: true,
                });
          }}
        >
          {nextLocation.pageIndex === pagesCount
            ? buttonFinishCaption
            : buttonNextCaption}
        </Button>,
        <Button
          key="2"
          css={buttonCss(showBackBtn)}
          onClick={() =>
            handleClick({
              location: prevLocation,
              slideMoveDirection: "left-to-right",
              needSendAnswers: true,
            })
          }
        >
          {buttonBackCaption}
        </Button>,
      ];
    }
  }
  return null;
};

export default bottomBtnRender;
