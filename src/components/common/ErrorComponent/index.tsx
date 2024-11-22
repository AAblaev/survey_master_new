import React from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import { IValidationResult } from "../../../types";

type IErrorComponent = {
	validationResult: IValidationResult;
};

const ErrorComponent: React.FC<IErrorComponent> = ({ validationResult }) => {
	const { t } = useTranslation();
	const { isValid, message, params } = validationResult;
	if (isValid) return null;

	return (
		<Tooltip title={t(message, params)}>
			<IconButton>
				<ErrorIcon />
			</IconButton>
		</Tooltip>
	);
};

export default ErrorComponent;
