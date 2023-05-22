import React from "react";
import { css } from "@emotion/react";
import { ILocation, ISlideMoveDirection } from "../../types";
import getPrevAndNextLocation from "../../utils/getPrevAndNextLocation";
import Button from "@material-ui/core/Button";

export const buttonCss = css`
  background-color: #3b424a;
  &.MuiButton-root {
    color: #fff;
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
};

const bottomBtnRender = ({
  location,
  buttonStartCaption,
  buttonNextCaption,
  buttonBackCaption,
  buttonFinishCaption,
  handleClick,
}: IBottomBtnRenderProps) => {
  const [prevLocation, nextLocation] = getPrevAndNextLocation(location);
  switch (location.pathName) {
    case "greeting": {
      return [
        <Button
          key="1"
          css={buttonCss}
          onClick={() =>
            handleClick({
              location: {
                pageIndex: 0,
                questionIndex: 0,
                pathName: "survey",
                title: "survey",
              },
              slideMoveDirection: "right-to-left",
              needSendAnswers: false,
            })
          }
        >
          {buttonStartCaption}
        </Button>,
      ];
    }
    case "survey": {
      return [
        <Button
          key="1"
          css={buttonCss}
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
          css={buttonCss}
          onClick={() =>
            handleClick({
              location: nextLocation,
              slideMoveDirection: "right-to-left",
              needSendAnswers: true,
            })
          }
        >
          {buttonNextCaption}
        </Button>,
        <Button
          key="2"
          css={buttonCss}
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
