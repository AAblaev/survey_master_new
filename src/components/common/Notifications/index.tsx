import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { ILocation, ILogicalValidityCheckRule, IState } from "../../../types";
import { approveLogicRuleStatus } from "../../../services/redux/actions";
import { notificationsWrapperCss } from "./sc";

const Alert = (props: AlertProps) => {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export type OwnProps = {
	location: ILocation;
};

export type StateProps = ReturnType<typeof mapStateToProps>;
export type DispatchProps = ReturnType<typeof mapDispathToProps>;
type INotifications = StateProps & OwnProps & DispatchProps;

const Notifications: React.FC<INotifications> = ({
	rules,
	deleteNotification,
}) => {
	const { t } = useTranslation();

	const handleClose = (docID: number) => {
		deleteNotification(String(docID));
	};

	return (
		<div>
			<Snackbar
				key={"asd"}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				open={true}
			>
				<div css={notificationsWrapperCss}>
					{rules.map((rule, index) => (
						<Alert
							key={index}
							severity="error"
							onClose={() => handleClose(rule.docID)}
						>
							{rule.title ? rule.title : t("error")}
						</Alert>
					))}
				</div>
			</Snackbar>
		</div>
	);
};

const mapStateToProps = (state: IState, props: OwnProps) => {
	const { dependentPagesDict, logicalValidityCheckRuleDict, data } = state;
	const { location } = props;

	const currentPage = data!.pages[location.pageIndex];
	const currentLogicalValidityCheckRuleIDs = dependentPagesDict[
		currentPage.docID
	]
		? dependentPagesDict[currentPage.docID]
		: [];

	const rules = currentLogicalValidityCheckRuleIDs.map(id => {
		if (!logicalValidityCheckRuleDict[id].status) {
			return logicalValidityCheckRuleDict[id].logicRule;
		}
	}) as ILogicalValidityCheckRule[];

	return { rules: rules.filter(item => !!item) };
};

const mapDispathToProps = (dispatch: Dispatch) => {
	return {
		deleteNotification: (docID: string) =>
			dispatch(approveLogicRuleStatus({ ruleDocID: docID })),
	};
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Notifications);
