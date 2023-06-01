import React from "react";
import { Progress } from "antd";
import Typography from "@material-ui/core/Typography";
import { DEFAULT_STROKE_COLOR, DEFAULT_TRAIL_COLOR } from "../../consts/const";

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
            strokeColor={DEFAULT_STROKE_COLOR}
            trailColor={DEFAULT_TRAIL_COLOR}
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
