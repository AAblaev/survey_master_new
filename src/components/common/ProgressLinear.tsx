import React from "react";
import { Progress } from "antd";
// import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import { DEFAULT_STROKE_COLOR, DEFAULT_TRAIL_COLOR } from "../../consts/const";
import { useSelector } from "react-redux";
import {
	getBrandColor,
	getProgressBarStyle,
} from "../../services/redux/selectors";
import { progressQuestionCountCss } from "../../sc";

type IProgressLinearProps = {
	allQuestionsDoneCount: number;
	allQuestionCount: number;
	isShowProgressbar: boolean;
	isShowQuestionsCount: boolean;
	progressbarCaption: string;
};

const ProgressLinear: React.FC<IProgressLinearProps> = ({
	allQuestionCount,
	allQuestionsDoneCount,
	isShowProgressbar,
	isShowQuestionsCount,
	progressbarCaption,
}) => {
	const {
		progressBarStyle: { progress: progressStyle, title },
	} = useSelector(getProgressBarStyle);
	// const { t } = useTranslation();

	const strokeColor = {
		"0%": progressStyle.strokeColor[0],
		"100%": progressStyle.strokeColor[1],
	};
	const progress = Math.floor((allQuestionsDoneCount / allQuestionCount) * 100);
	const questionCount = `${progressbarCaption}: ${allQuestionsDoneCount} / ${allQuestionCount} (${progress}%)`;
	return (
		<>
			{isShowQuestionsCount && (
				<div css={progressQuestionCountCss(title.font.size, title.font.color)}>
					{questionCount}
				</div>
			)}
			{isShowProgressbar && (
				<>
					{false && (
						<Typography variant="body1" gutterBottom>
							{progressbarCaption}
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
