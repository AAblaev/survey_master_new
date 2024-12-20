import React from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Nav from "../../common/Nav";
import { IState } from "../../../types";
import {
	COMPLETE_SURVEY,
	SAGA_CHANGE_CURRENT_PAGE,
	SAGA_CHANGE_LOCATION,
	START_SURVEY,
} from "../../../services/redux/types";
import {
	goToTheNextPage,
	selectSection,
} from "../../../services/redux/actions";
import { buttonCss, iconBtnCss } from "./sc";

export type ISwitcherProps = ConnectedProps<typeof connector>;

const Switcher: React.FC<ISwitcherProps> = ({
	location,
	buttonStartCaption,
	buttonNextCaption,
	buttonBackCaption,
	buttonFinishCaption,
	isShowPageList,
	isShowButtonBack,
	startSurvey,
	isEmptyData,
	pages,
	uid,
	continueSurvey,
	setNextPage,
	setPrevPage,
	selectPage,
	pageList,
	setFirstPage,
	pageTitle,
	showFinishBtn,
	completeSurvey,
	strictModeNavigation,
}) => {
	const { t } = useTranslation();

	if (isEmptyData) {
		return null;
	}

	const { pageIndex } = location;
	// const showBackBtn = !(!isShowPageList && pageIndex === 0);
	const showBackBtn =
		isShowButtonBack &&
		!(
			(!isShowPageList && pageIndex === 0) ||
			(strictModeNavigation && pageIndex === 0)
		);
	const showNavList = isShowButtonBack && pageList.length > 1;
	const firstPageDocID = String(pages[0].docID);

	switch (location.pathName) {
		case "greeting": {
			return (
				<>
					<Button key="1" css={buttonCss(true, "right")} onClick={startSurvey}>
						{uid ? "начать заново" : buttonStartCaption}
					</Button>

					{uid && (
						<Button
							key="2"
							css={buttonCss(true, "left")}
							onClick={continueSurvey}
						>
							{t("buttonContinueCaption")}
						</Button>
					)}
				</>
			);
		}
		case "survey": {
			return (
				<>
					<Button
						key="1"
						css={buttonCss(true, "right")}
						onClick={() => setFirstPage(firstPageDocID)}
					>
						{buttonNextCaption}
					</Button>

					<IconButton
						key="IconButton1"
						css={iconBtnCss("right")}
						onClick={() => setFirstPage(firstPageDocID)}
					>
						<ChevronRightIcon fontSize="large" />
					</IconButton>

					<IconButton key="IconButton2" css={iconBtnCss("left")} disabled>
						<ChevronRightIcon fontSize="large" />
					</IconButton>
				</>
			);
		}
		case "section": {
			return (
				<>
					<Nav
						title={pageTitle}
						pageList={pageList}
						showList={showNavList}
						selectPage={selectPage}
					/>

					<Button
						key="1"
						css={buttonCss(true, "right")}
						onClick={
							showFinishBtn ? () => completeSurvey() : () => setNextPage()
						}
					>
						{showFinishBtn ? buttonFinishCaption : buttonNextCaption}
					</Button>

					<Button
						key="2"
						css={buttonCss(showBackBtn, "left")}
						onClick={() => setPrevPage()}
					>
						{buttonBackCaption}
					</Button>

					<IconButton
						key="IconButton1"
						css={iconBtnCss("right")}
						onClick={() => {
							setNextPage();
						}}
						disabled={showFinishBtn}
					>
						<ChevronRightIcon fontSize="large" />
					</IconButton>

					<IconButton
						key="IconButton2"
						css={iconBtnCss("left")}
						disabled={!showBackBtn}
						onClick={() => setPrevPage()}
					>
						<ChevronRightIcon fontSize="large" />
					</IconButton>
				</>
			);
		}
	}
	return <></>;
};

// disabled={strictModeNavigation && location.pageIndex === 0}

const mapStateToProps = (state: IState) => {
	const {
		location,
		slideMoveDirection,
		userAnswers,
		modalVisible,
		data,
		params,
		pageMovementLogs,
		pageTransitionRuleDict,
		strictModeNavigation,
		pagesDict,
	} = state;

	const isEmptyData = !Boolean(data);
	const buttonStartCaption = data?.buttonStartCaption || "";
	const buttonNextCaption = data?.buttonNextCaption || "";
	const buttonBackCaption = data?.buttonBackCaption || "";
	const buttonFinishCaption = data?.buttonFinishCaption || "";
	const isShowButtonBack = data?.isShowButtonBack || false;
	const isShowPageList = data?.isShowPageList || false;
	const pages = data?.pages || [];

	const pagesCount = pages.length;
	const uid = isEmptyData ? "" : params?.uid;
	const currentPage = pages[location.pageIndex];
	const pageTransitionRules = pageTransitionRuleDict[String(currentPage.docID)];
	const showFinishBtn =
		location.pageIndex + 1 === pagesCount && !pageTransitionRules;
	const pageList = strictModeNavigation
		? pageMovementLogs.map(pageDocID => pagesDict[pageDocID].page)
		: pages;

	const { pageIndex } = location;

	const pageTitle = pages[pageIndex].title
		? pages[pageIndex].title
		: strictModeNavigation
		? `Страница ${pageMovementLogs.indexOf(String(currentPage.docID)) + 1}`
		: `Страница ${location.pageIndex + 1}`;

	// console.log("strictModeNavigation", strictModeNavigation);
	return {
		isEmptyData,
		userAnswers,
		location,
		slideMoveDirection,
		modalVisible,
		buttonStartCaption,
		buttonNextCaption,
		buttonBackCaption,
		buttonFinishCaption,
		isShowPageList,
		isShowButtonBack,
		pages,
		pagesCount,
		uid,
		showFinishBtn,
		pageList,
		pageTitle,
		strictModeNavigation,
	};
};

const mapDispathToProps = (dispatch: Dispatch) => {
	return {
		startSurvey: () => dispatch({ type: START_SURVEY, isContinue: false }),
		continueSurvey: () => dispatch({ type: START_SURVEY, isContinue: true }),
		setNextPage: (docID?: string) =>
			dispatch({
				type: SAGA_CHANGE_LOCATION,
				direction: "right-to-left",
				targetPageID: docID,
			}),
		setPrevPage: (docID?: string) =>
			dispatch({
				type: SAGA_CHANGE_LOCATION,
				direction: "left-to-right",
				targetPageID: docID,
			}),

		setFirstPage: (targetPageID: string) => {
			dispatch(goToTheNextPage({ direction: "right-to-left", targetPageID }));
		},
		selectPage: (pageDocID: string) => dispatch(selectSection({ pageDocID })),
		completeSurvey: () => {
			dispatch({ type: COMPLETE_SURVEY });
		},
	};
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Switcher);
