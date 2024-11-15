import React from "react";
import { useTranslation } from "react-i18next";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Progress } from "antd";
import { IPage, IUserAnswer } from "../../types";
import { DEFAULT_STROKE_COLOR, DEFAULT_TRAIL_COLOR } from "../../consts/const";
import { accordionCss, pageCss, questionNumberCss } from "./sc";
import { useSelector } from "react-redux";
import {
	getBrandColor,
	getProgressBarStyle,
} from "../../services/redux/selectors";

type ISurveyProps = {
	selectPage: (pageID: string) => void;
	pages: IPage[];
	userAnswers: IUserAnswer;
	isShowQuestionsCount: boolean;
	buttonMoveCaption: string;
	requiredQuestions: string;
	totalQuestions: string;
};

const Survey: React.FC<ISurveyProps> = ({
	selectPage,
	pages,
	userAnswers,
	isShowQuestionsCount,
	buttonMoveCaption,
	requiredQuestions,
	totalQuestions,
}) => {
	const { brandColor } = useSelector(getBrandColor);
	const {
		progressBarStyle: { progress, title },
	} = useSelector(getProgressBarStyle);

	const strokeColor = {
		"0%": progress.strokeColor[0],
		"100%": progress.strokeColor[1],
	};

	const { t } = useTranslation();

	return (
		<div css={pageCss}>
			<div>
				{pages.map((page, index) => {
					const allQuestionCount = page.questions.filter(
						q => q.config.dataType !== "textblock"
					).length;
					const requiredQuestionsCount = page.questions.filter(
						q => q.config.dataType !== "textblock" && q.isRequired
					).length;
					let doneQuestionCount = 0;
					page.questions.forEach(q => {
						userAnswers.hasOwnProperty(q.docID) &&
							userAnswers[q.docID].values.length !== 0 &&
							doneQuestionCount++;
					});

					const title = page.title ? page.title : `страница ${index + 1}`;

					return (
						<Accordion
							key={index}
							defaultExpanded={isShowQuestionsCount ? false : true}
							disabled={false}
							css={accordionCss}
							elevation={0}
						>
							<AccordionSummary
								expandIcon={
									isShowQuestionsCount ? <ExpandMoreIcon /> : <div></div>
								}
								aria-controls={String(page.docID)}
								id={String(page.docID)}
							>
								{isShowQuestionsCount && (
									<Progress
										type="circle"
										size={50}
										strokeColor={strokeColor}
										trailColor={progress.trailColor}
										percent={Math.floor(
											(doneQuestionCount / allQuestionCount) * 100
										)}
									/>
								)}

								<Typography>{title}</Typography>
								{!isShowQuestionsCount && (
									<Button
										style={{ marginLeft: "auto" }}
										variant="contained"
										size="small"
										onClick={() => {
											selectPage(String(page.docID));
										}}
									>
										{buttonMoveCaption}
									</Button>
								)}
							</AccordionSummary>
							{isShowQuestionsCount && (
								<AccordionDetails>
									<div>
										<div className="questionSize">
											<div className="question">{totalQuestions}:</div>
											<div css={questionNumberCss(brandColor)}>
												{allQuestionCount}
											</div>
										</div>
										<div className="questionSize">
											<div className="question">{requiredQuestions}:</div>
											<div css={questionNumberCss(brandColor)}>
												{requiredQuestionsCount}
											</div>
										</div>
									</div>
									<Button
										variant="contained"
										size="small"
										onClick={() => {
											selectPage(String(page.docID));
										}}
									>
										{buttonMoveCaption}
									</Button>
								</AccordionDetails>
							)}
						</Accordion>
					);
				})}
			</div>
		</div>
	);
};

export default Survey;
