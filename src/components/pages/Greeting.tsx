import React from "react";
// import { useTranslation } from "react-i18next";
import { IState } from "../../types";
import { onlyDesctopButtonCss } from "../../sc";
import Button from "@mui/material/Button";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { buttonsWrapperCss, greatingPageCss } from "./sc";
import { START_SURVEY } from "../../services/redux/types";

type IGreetingProps = {
	html: string;
	buttonStartCaption: string;
};

export type IOwnGreetingProps = IGreetingProps &
	ConnectedProps<typeof connector>;

const Greeting: React.FC<IOwnGreetingProps> = ({
	html,
	buttonStartCaption,
	uid,
	startSurvey,
	continueSurvey,
}) => {
	// const { t } = useTranslation();

	return (
		<div css={greatingPageCss}>
			<div dangerouslySetInnerHTML={{ __html: html }}></div>
			<div css={buttonsWrapperCss}>
				<Button
					key="start"
					variant={"contained"}
					css={onlyDesctopButtonCss}
					onClick={startSurvey}
				>
					{buttonStartCaption}
				</Button>
			</div>
		</div>
	);
};

const mapStateToProps = (state: IState) => {
	const { params } = state;
	const { uid } = params;
	return { uid };
};

const mapDispathToProps = (dispatch: Dispatch) => {
	return {
		startSurvey: () => dispatch({ type: START_SURVEY, isContinue: false }),
		continueSurvey: () => dispatch({ type: START_SURVEY, isContinue: true }),
	};
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Greeting);
