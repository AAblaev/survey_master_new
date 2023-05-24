import React from "react";
import { Progress } from "antd";
import Typography from "@material-ui/core/Typography";
import { DEFAULT_STROKE } from "../../consts/const";

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
  return (
    <div className="progress">
      {isShowProgressbar && (
        <>
          <Typography variant="body1" gutterBottom>
            Общий прогресс
          </Typography>

          <Progress strokeColor={DEFAULT_STROKE} percent={progress} />
        </>
      )}
      {isShowQuestionsCount && (
        <Typography variant="caption" display="block" gutterBottom>
          {`Выполнено вопросов: ${allQuestionsDoneCount}/${allQuestionCount}`}
        </Typography>
      )}
    </div>
  );
};

export default ProgressLinear;
