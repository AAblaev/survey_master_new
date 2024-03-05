import React, { useState, useMemo, useRef, useEffect } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { DEFAULT_LIMIT_TIME, PRIMARY_COLOR } from "../../consts/const";
import { IData } from "../../types";

type ITimerProps = {
  limitTime: IData["limitTime"];
  completeTimer: () => void;
  digitBlockStyle: React.CSSProperties;
  separatorStyle: { color: string; size: number };
  dividerStyle: React.CSSProperties;
};

//
// {(pathName === "survey" || pathName === "section") &&
//   isLimitTimeForCompletion && (
//
//   )}

const Timer: React.FC<ITimerProps> = ({
  limitTime,
  completeTimer,
  digitBlockStyle,
  dividerStyle,
  separatorStyle,
}) => {
  // const isLimitTimeForCompletion = true;
  // const limitTime = 3000;
  const totalTime = useRef(limitTime);
  const [isCompleted, setCompleted] = useState(false);
  // console.log("render");
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

  useEffect(() => {
    // console.log("useEffect");
    return () => {
      // console.log("useEffect", totalTime.current);
    };
  }, [isCompleted]);
  return (
    <FlipClockCountdown
      to={limitTo}
      onTick={({ timeDelta, completed }) => {
        totalTime.current = timeDelta.total;
        if (completed) {
          setCompleted(true);
        }
      }}
      renderMap={countdownRenderMap}
      digitBlockStyle={digitBlockStyle}
      separatorStyle={separatorStyle}
      dividerStyle={dividerStyle}
      showLabels={false}
      hideOnComplete={false}
      onComplete={() => {
        completeTimer();
      }}
    />
  );
};

export default Timer;
