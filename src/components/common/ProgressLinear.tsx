import React from "react";
import { Progress } from "antd";
import Typography from "@material-ui/core/Typography";
import { DEFAULT_STROKE } from "../../consts/const";

type IProgressLinearProps = {
  allQuestionsDoneCount: number;
  allQuestionCount: number;
};

const ProgressLinear: React.FC<IProgressLinearProps> = ({
  allQuestionCount,
  allQuestionsDoneCount,
}) => {
  const progress = Math.floor((allQuestionsDoneCount / allQuestionCount) * 100);
  return (
    <div>
      <div className="progress">
        <Typography variant="body1" gutterBottom>
          Общий прогресс
        </Typography>
        <Progress strokeColor={DEFAULT_STROKE} percent={progress} />
        <Typography variant="caption" display="block" gutterBottom>
          {`Выполнено вопросов: ${allQuestionsDoneCount}/${allQuestionCount}`}
        </Typography>
      </div>
    </div>
  );
};

export default ProgressLinear;
