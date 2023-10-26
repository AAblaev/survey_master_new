import React from "react";
import { Progress } from "antd";
import Typography from "@material-ui/core/Typography";
import { DEFAULT_STROKE_COLOR, DEFAULT_TRAIL_COLOR } from "../../consts/const";
import { useSelector } from "react-redux";
import {
  getBrandColor,
  getProgressBarStyle,
} from "../../services/redux/selectors";

type IProgressLinearProps = {
  allQuestionsDoneCount: number;
  allQuestionCount: number;
  isShowProgressbar: boolean;
  isShowQuestionsCount: boolean;
};

const ProgressLinear: React.FC<IProgressLinearProps> = ({
  allQuestionCount,
  allQuestionsDoneCount,
  isShowProgressbar,
  isShowQuestionsCount,
}) => {
  const {
    progressBarStyle: { progress: progressStyle, title },
  } = useSelector(getProgressBarStyle);

  const strokeColor = {
    "0%": progressStyle.strokeColor[0],
    "100%": progressStyle.strokeColor[1],
  };
  const progress = Math.floor((allQuestionsDoneCount / allQuestionCount) * 100);
  const questionCount = `ПРОЙДЕНО: ${allQuestionsDoneCount} из ${allQuestionCount} (${progress}%)`;
  return (
    <>
      {isShowQuestionsCount && (
        <div className="progress-question-count">{questionCount}</div>
      )}
      {isShowProgressbar && (
        <>
          {false && (
            <Typography variant="body1" gutterBottom>
              Общий прогресс
            </Typography>
          )}

          <Progress
            strokeColor={strokeColor}
            trailColor={progressStyle.trailColor}
            percent={progress}
            showInfo={false}
            size="small"
          />
        </>
      )}
    </>
  );
};

export default ProgressLinear;
