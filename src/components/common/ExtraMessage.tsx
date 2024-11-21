import React from "react";
import { useTranslation } from "react-i18next";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ErrorIcon from "@mui/icons-material/Error";
import { IConfig } from "../../types";
import { limitMessageCss, limitMessageWrapperCss } from "../questions/sc";
import { css } from "@emotion/react";
// import { getDateRangeMessage } from "../../utils/dateParser";

type IExtraMessageProps = {
	config: IConfig;
	needCorrect: boolean;
	isReqRowAndColCheckSuccess: boolean;
};

export const alertCss = css`
	position: absolute;
	top: -10px;
	right: -40px;
	z-index: 1000000000;
`;

const ExtraMessage: React.FC<IExtraMessageProps> = ({
	config,
	needCorrect,
	isReqRowAndColCheckSuccess,
}) => {
	const { t } = useTranslation();
	const {
		isLimited,
		isLimitedValue,
		limit,
		limitValue,
		dataType,
		dateType,
		requiredRowsCount,
		requiredColunmsCount,
		simpleType,
		options,
		isRequired,
		isSimpleDateLimit,
		simpleDateMax,
		simpleDateMin,
	} = config;

	// isRequired

	const getDateRangeMessage = (dateType: number) => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		switch (dateType) {
			case 1: {
				return t("extraMessagePastDateRequired");
			}
			case 2: {
				return t("extraMessagePastOrTodayDateRequired");
			}
			case 3: {
				return t("extraMessageFutureDateRequired");
			}
			case 4: {
				return t("extraMessageFutureOrTodayDateRequired");
			}
			case 0:
			default:
				return "";
		}
	};

	const getExtraText = () => {
		let result = "";

		if (simpleType === "integer") {
			result += t("extraMessageInteger");
		}
		if (simpleType === "float") {
			result += t("extraMessageFloat");
		}

		if (simpleType === "datetime") {
			result += ``;
		}
		if (isLimited) {
			result += t("extraMessageLimited", {
				min: limit?.min,
				max: limit?.max,
			});
		}
		if (isLimitedValue) {
			result += t("extraMessageLimitedValue", {
				min: limitValue?.min,
				max: limitValue?.max,
			});
		}

		if (isSimpleDateLimit) {
			result += t("extraMessageDateLimited", {
				startDate: simpleDateMin!.split(" ")[0],
				endDate: simpleDateMax!.split(" ")[0],
			});
		} else {
			result += getDateRangeMessage(dateType as number);
		}

		if (dataType === "freelist" && isRequired) {
			const rowsCount = options!.filter(
				option => option.dimension === 0
			).length;

			const allRowsAreRequired =
				requiredRowsCount === 0 || requiredRowsCount === rowsCount;

			result += allRowsAreRequired
				? t("extraMessageRequiredRows")
				: t("extraMessageRequiredRows", { rows: requiredRowsCount });
		}

		if (dataType === "matrix" && isRequired) {
			const columnsCount = options!.filter(
				option => option.dimension === 1
			).length;

			const rowsCount = options!.filter(
				option => option.dimension === 0
			).length;

			const allColumnsAreRequired =
				requiredColunmsCount === 0 || requiredColunmsCount === columnsCount;
			const allRowsAreRequired =
				requiredRowsCount === 0 || requiredRowsCount === rowsCount;

			if (allColumnsAreRequired && allRowsAreRequired) {
				result += t("extraMessageRequiredRowsAndColumns");
				return result;
			}

			if (requiredRowsCount === 1 && requiredColunmsCount === 1) {
				result += t("extraMessageRequiredOneRowsMatrix");
				return result;
			}

			if (requiredRowsCount === 1) {
				result += allColumnsAreRequired
					? t("extraMessageRequiredAllColumsMatrix")
					: t("extraMessageRequiredMinimumColumsMatrix", {
							columns: requiredColunmsCount,
					  });
				return result;
			}

			if (requiredColunmsCount === 1) {
				result += allRowsAreRequired
					? t("extraMessageRequiredAllRowsMatrix")
					: t("extraMessageRequiredMinimumRowsMatrix", {
							rows: requiredRowsCount,
					  });
				return result;
			}
		}
		return result;
	};

	const text = getExtraText();
	if (text === "") return null;

	return (
		<div css={limitMessageWrapperCss}>
			<div css={limitMessageCss}>{text}</div>
			{needCorrect && !isReqRowAndColCheckSuccess && (
				<div css={alertCss}>
					<Tooltip title={t("extraMessageTooltip")}>
						<IconButton>
							<ErrorIcon />
						</IconButton>
					</Tooltip>
				</div>
			)}
		</div>
	);
};

export default ExtraMessage;
