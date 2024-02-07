import React, { useMemo, useRef } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { DEFAULT_LIMIT_TIME, PRIMARY_COLOR } from "../../consts/const";
import { IData } from "../../types";

type ITimerProps = {
  limitTime: IData["limitTime"];
  brandColor: string;
  completeSurveyByTimer: () => void;
};
//
// {(pathName === "survey" || pathName === "section") &&
//   isLimitTimeForCompletion && (
//
//   )}

const Timer: React.FC<ITimerProps> = ({
  limitTime,
  brandColor,
  completeSurveyByTimer,
}) => {
  // const isLimitTimeForCompletion = true;
  // const limitTime = 3000;
  const limitTo = useMemo(() => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + limitTime);
    return date;
  }, [limitTime]);
  const diffInHours = useMemo(() => {
    return Math.abs(new Date().getTime() - limitTo.getTime()) / 3600000;
  }, [limitTo]);
  const countdownRenderMap: [
    boolean,
    boolean,
    boolean,
    boolean
  ] = useMemo(() => {
    return [diffInHours >= 24, diffInHours >= 1, true, true];
  }, [diffInHours]);
  return (
    <div css={{ marginRight: "auto" }}>
      <FlipClockCountdown
        to={limitTo}
        renderMap={countdownRenderMap}
        digitBlockStyle={{
          width: 20,
          height: 30,
          fontSize: 15,
          color: brandColor,
          backgroundColor: "white",
        }}
        separatorStyle={{
          size: 4,
          color: "white",
        }}
        dividerStyle={{
          height: 0,
        }}
        showLabels={false}
        onComplete={() => {
          completeSurveyByTimer();
        }}
      />
    </div>
  );
};

export default Timer;
