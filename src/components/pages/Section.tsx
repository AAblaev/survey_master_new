import React from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Question from "../questions";
import TextBlock from "../textBlock";
import DelayWrapper from "../common/DelayWrapper";
import QuestioinsGroup from "../group";
import { IPage, IState } from "../../types";
import { questionListCss, completeButtonCss } from "./sc";
import { visibleChecking } from "../../utils/rule-utils";
import { COMPLETE_SURVEY } from "../../services/redux/types";

export type IOwnSectionProps = ISectionProps & ConnectedProps<typeof connector>;

export type ISectionProps = {
	page: IPage;
};

const Section: React.FC<IOwnSectionProps> = ({
	page,
	questionCount,
	showCompleteBtn,
	completeSurvey,
	questionGroupStyles,
	showGroup,
	buttonFinishCaption,
}) => {
	const { t } = useTranslation();

	const questions = page.questions ? page.questions : [];
	let counter = 0;

	return (
		<div css={questionListCss(questionCount)}>
			{false && (
				<QuestioinsGroup
					docID={333}
					title="Группа вопросов"
					questions={questions}
					questionGroupStyles={questionGroupStyles}
					pageID={page.docID}
					expand={false}
				/>
			)}

			{false && (
				<Question
					key={"123"}
					index={33}
					currentQuestionIndex={0}
					question={{
						...questions[0],
						title: t("attachFile"),
						config: {
							...questions[0].config,
							dataType: "fileuploader",
							filesCount: 5,
							fileSizeLimit: 45,
						},
					}}
					pageID={page.docID}
					isGrouped={false}
				/>
			)}

			{questions.map((q, index) => {
				if (q.config.dataType === "textblock") {
					return <TextBlock key={index} question={q} />;
				}
				counter++;
				return (
					<Question
						key={q.docID}
						index={index}
						currentQuestionIndex={questionCount + counter}
						question={q}
						pageID={page.docID}
						isGrouped={false}
					/>
				);
			})}

			{showCompleteBtn && (
				<DelayWrapper>
					<Button
						key="continue"
						variant="contained"
						css={completeButtonCss}
						onClick={() => completeSurvey()}
					>
						{buttonFinishCaption}
					</Button>
				</DelayWrapper>
			)}
		</div>
	);
};

const mapStateToProps = (state: IState) => {
	const {
		location,
		userAnswers,
		visiblityRulesDict,
		data,
		pageTransitionRuleDict,
		pageMovementLogs,
		pagesDict,
		styles,
	} = state;

	const showGroup = state.params.surveyID === "group_questions";

	const {
		globalStyle: { brandColor },
		componentsStyle: { questionGroup: questionGroupStyles },
	} = styles;

	const { pageIndex } = location;
	const pages = data!.pages || [];

	const currentPage = pages[pageIndex];
	const hasTransitionRule = pageTransitionRuleDict.hasOwnProperty(
		String(currentPage.docID)
	);

	const isLastPage = pageIndex === pages.length - 1;

	const showCompleteBtn = isLastPage && !hasTransitionRule;

	const prevPages = pageMovementLogs
		.map((pageID, index) => {
			if (index + 1 !== pageMovementLogs.length) return pagesDict[pageID].page;
		})
		.filter(page => !!page) as IPage[];

	const questionCount: number = prevPages.reduce((acc, page) => {
		const currentQuestionsCount = page.questions.reduce((pageAcc, question) => {
			const visibilityRule = visiblityRulesDict[String(question.docID)];
			const isVisible =
				question.config.dataType !== "textblock" &&
				visibleChecking(userAnswers, visibilityRule);
			return pageAcc + (isVisible ? 1 : 0);
		}, 0);

		return acc + currentQuestionsCount;
	}, 0);

	const buttonFinishCaption = data ? data.buttonFinishCaption : "";

	return {
		questionCount,
		showCompleteBtn,
		questionGroupStyles,
		showGroup,
		buttonFinishCaption,
	};
};

const mapDispathToProps = (dispatch: Dispatch) => {
	return {
		completeSurvey: () => dispatch({ type: COMPLETE_SURVEY }),
	};
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Section);
