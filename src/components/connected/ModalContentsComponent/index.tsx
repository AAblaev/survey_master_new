import React from "react";
import { Dispatch } from "redux";
import { useTranslation } from "react-i18next";

import { Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { connect, ConnectedProps } from "react-redux";
import { ModalContent, ModalHeader } from "../../common/modal";
import { modalHeaderWrapperCss, onlyDesctopButtonCss } from "../../../sc";
import { buttonsWrapperCss } from "../../pages/sc";
import { IState } from "../../../types";
import {
	COMPLETE_SURVEY,
	SAGA_START_AGAIN,
	START_SURVEY,
} from "../../../services/redux/types";
import { goToFirstDeviationPage } from "../../../services/redux/actions";

type IModalContentComponentProps = {
	closeModal: () => void;
};

export type IOwnModalContentComponentProps = IModalContentComponentProps &
	ConnectedProps<typeof connector>;

const ModalContentComponent: React.FC<IOwnModalContentComponentProps> = ({
	modalMessage,
	buttonMoveCaption,
	closeModal,
	startSurvey,
	continueSurvey,
	completeSurvey,
	goToQuesions,
}) => {
	// console.log("modalMessage.code", modalMessage.code);
	const { t } = useTranslation();

	switch (modalMessage.code) {
		case 101: {
			return (
				<>
					<ModalHeader>
						<div css={modalHeaderWrapperCss}>
							<span>{t("greetingCaption")}</span>
							<IconButton onClick={() => closeModal()}>
								<CloseIcon />
							</IconButton>
						</div>
					</ModalHeader>
					<ModalContent>
						<Typography variant="h6">{t("askToContinue")}</Typography>
						<div css={buttonsWrapperCss}>
							<Button
								key="start"
								variant="outlined"
								color="primary"
								onClick={() => {
									startSurvey();
								}}
							>
								{t("buttonStartAgainCaption")}
							</Button>

							<Button
								key="continue"
								variant="contained"
								onClick={() => {
									continueSurvey();
									closeModal();
								}}
							>
								{t("buttonContinueCaption")}
							</Button>
						</div>
					</ModalContent>
				</>
			);
		}
		case 201: {
			return (
				<>
					<ModalHeader>
						<div css={modalHeaderWrapperCss}>
							<span>{t("cancel")}</span>
							<IconButton onClick={() => closeModal()}>
								<CloseIcon />
							</IconButton>
						</div>
					</ModalHeader>
					<ModalContent>
						<Typography variant="h6">{t("requestRequiredMessage")}</Typography>
					</ModalContent>
				</>
			);
		}
		case 202: {
			return (
				<>
					<ModalHeader>
						<div css={modalHeaderWrapperCss}>
							<span>{t("cancel")}</span>
							<IconButton onClick={() => closeModal()}>
								<CloseIcon />
							</IconButton>
						</div>
					</ModalHeader>
					<ModalContent>
						<Typography variant="h6">{t("checkAnswerMessage")}</Typography>
					</ModalContent>
				</>
			);
		}

		case 301: {
			return (
				<>
					<ModalHeader>
						<div css={modalHeaderWrapperCss}>
							<span>{t("buttonFinishCaption")}?</span>
						</div>
					</ModalHeader>
					<ModalContent>
						<div style={{ display: "flex", gap: "20px" }}>
							<Button
								key="complete"
								variant="contained"
								onClick={() => {
									completeSurvey();
									closeModal();
								}}
							>
								{t("buttonYesCaption")}
							</Button>
							<Button
								key="continue"
								variant="contained"
								onClick={() => {
									closeModal();
								}}
							>
								{t("buttonNoCaption")}
							</Button>
						</div>
					</ModalContent>
				</>
			);
		}
		case 302: {
			return (
				<>
					<ModalHeader>
						<div css={modalHeaderWrapperCss}>
							<span>{t("cancel")}</span>
						</div>
					</ModalHeader>
					<ModalContent>
						<Typography variant="h6">{t("requestRequiredMessage")}</Typography>
						<div css={buttonsWrapperCss}>
							<Button
								key="to_question"
								variant="outlined"
								onClick={() => {
									goToQuesions();
								}}
							>
								{buttonMoveCaption}
							</Button>
							<Button
								key="continue"
								variant="contained"
								onClick={() => {
									closeModal();
								}}
							>
								{t("buttonCloseCaption")}
							</Button>
						</div>
					</ModalContent>
				</>
			);
		}

		case 303: {
			return (
				<>
					<ModalHeader>
						<div css={modalHeaderWrapperCss}>
							<span>{t("cancel")}</span>
						</div>
					</ModalHeader>
					<ModalContent>
						<Typography variant="h6">{t("checkAnswerMessage")}</Typography>
						<div style={{ display: "flex", gap: "20px" }}>
							<Button
								key="continue"
								variant="contained"
								onClick={() => {
									closeModal();
								}}
							>
								{buttonMoveCaption}
							</Button>
							<Button
								key="continue"
								variant="contained"
								onClick={() => {
									closeModal();
								}}
							>
								{t("buttonCloseCaption")}
							</Button>
						</div>
					</ModalContent>
				</>
			);
		}
		case 401: {
			return null;
		}
	}
};

const mapStateToProps = (state: IState) => {
	const { modalMessage, data } = state;
	const buttonMoveCaption = data ? data.buttonMoveCaption : "";
	return { modalMessage, buttonMoveCaption };
};

const mapDispathToProps = (dispatch: Dispatch) => {
	return {
		startSurvey: () => dispatch({ type: SAGA_START_AGAIN }),
		continueSurvey: () => dispatch({ type: START_SURVEY, isContinue: true }),
		completeSurvey: () => dispatch({ type: COMPLETE_SURVEY }),
		goToQuesions: () => dispatch(goToFirstDeviationPage()),
	};
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(ModalContentComponent);
