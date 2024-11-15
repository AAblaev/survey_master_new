import React from "react";
import { useTranslation } from "react-i18next";
import FormControlLabel from "@mui/material/FormControlLabel";
import GreenCheckbox from "../../../common/GreenCheckbox";
import { IAnswer } from "../../../../types";
import { EXTRA_ANSWER } from "../../../../consts/const";
import GreenRadio from "../../../common/GreenRadio";

export type INothingCheckboxProps = {
	userAnswer: IAnswer;
	setAnswer: (answer: IAnswer) => void;
	questionID: number;
	singleAnswer: boolean;
	nothingPlaceholder: string;
};

const NothingCheckbox: React.FC<INothingCheckboxProps> = ({
	userAnswer,
	setAnswer,
	questionID,
	nothingPlaceholder,
	singleAnswer,
}) => {
	const { t } = useTranslation();

	const checked = Boolean(
		userAnswer &&
			userAnswer.values.length &&
			userAnswer.values[0].optionID === EXTRA_ANSWER.NOTHING
	);
	const ControlComponent = singleAnswer ? GreenRadio : GreenCheckbox;
	const handleChange = () => {
		if (checked) {
			setAnswer({
				questionID: questionID,
				values: [],
			});
			return;
		}

		setAnswer({
			questionID: questionID,
			values: [
				{
					optionID: EXTRA_ANSWER.NOTHING,
					value: t("noneOfTheAbove"),
					validationResult: { isValid: true, message: "success" },
					isFocused: false,
				},
			],
		});
	};
	return (
		<FormControlLabel
			control={
				<ControlComponent
					checked={checked}
					onChange={() => handleChange()}
					name={"name"}
				/>
			}
			label={nothingPlaceholder ? nothingPlaceholder : t("noneOfTheAbove")}
			key={"notAnyOne"}
		/>
	);
};

export default NothingCheckbox;
