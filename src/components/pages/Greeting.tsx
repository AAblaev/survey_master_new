import React from "react";
import { ILocation, ISlideMoveDirection } from "../../types";
import { onlyDesctopButtonCss } from "../../sc";
import { Button } from "@material-ui/core";

type IGreetingProps = {
  html: string;
  startSurvey: () => void;
  isShowPageList: boolean;
  buttonStartCaption: string;
  handleClick: (payload: {
    location: ILocation;
    slideMoveDirection: ISlideMoveDirection;
    needSendAnswers: boolean;
  }) => void;
};

const Greeting: React.FC<IGreetingProps> = ({
  html,
  handleClick,
  isShowPageList,
  startSurvey,
  buttonStartCaption,
}) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
      <Button
        key="start"
        variant="contained"
        css={onlyDesctopButtonCss}
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
      </Button>
    </div>
  );
};

export default Greeting;
