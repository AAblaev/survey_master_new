import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { ruRU } from "@mui/x-date-pickers/locales";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import { REGEXP_DICT, validation } from "../../../../utils/validation";
import { IViewComponentProps } from "../..";
import { css } from "@emotion/react";
import {
	dateParser,
	dateParserForDayjs,
	getDateRange,
} from "../../../../utils/dateParser";
import { FORMAT_MASK_EN, FORMAT_MASK_RU } from "../datePicker/const";
import ErrorComponent from "../../../common/ErrorComponent";
import {
	alertCss,
	dateListCss,
	datePickerCss,
	freeListItemCss,
	freeListItemLabelCss,
	textFieldWrapperCss,
} from "./sc";

const ruLocale =
	ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

const DatePickerListView: React.FC<IViewComponentProps> = ({
	question,
	setAnswer,
	userAnswer,
	locale,
}) => {
	const { docID, config } = question;
	const { isSimpleDateLimit, simpleDateMax, simpleDateMin, dateType } = config;
	const options = config.options!;
	const userAnswerExist = userAnswer && userAnswer.values.length > 0;

	const values = userAnswerExist ? userAnswer.values : [];

	const onChange = (
		newValue: dayjs.Dayjs | null,
		item: (typeof options)[0]
	) => {
		const isFieldEmpty = !values.some(v => v.optionID === item.docID);
		const isFocused = values.some(
			v => v.optionID === item.docID && v.isFocused
		);

		const value_str =
			dateParser(newValue ? newValue.toDate() : null, locale) ?? "";

		const validationResult = validation({
			value: value_str,
			simpleType: "datetime",
			isSimpleDateLimit,
			simpleDateMin,
			simpleDateMax,
			locale,
		});

		if (isFocused) return;

		const newValues = isFieldEmpty
			? [
					...values,
					{
						optionID: item.docID,
						value: value_str,
						validationResult: validationResult,
						isFocused: false,
					},
			  ]
			: values.map(value => {
					if (value.optionID === item.docID) {
						return {
							optionID: value.optionID,
							value: value_str,
							validationResult: validationResult,
							isFocused: false,
						};
					}
					return value;
			  });

		setAnswer({
			questionID: docID,
			values: newValues,
		});
	};

	const handleFocus = (e: any, item: (typeof options)[0]) => {
		const isFieldEmpty = !values.some(v => v.optionID === item.docID);

		const newValue = isFieldEmpty
			? [
					...values,
					{
						optionID: item.docID,
						value: "",
						validationResult: { isValid: false, message: "пусто" },
						isFocused: true,
					},
			  ]
			: values.map(value => {
					if (value.optionID === item.docID) {
						return {
							optionID: value.optionID,
							value: value.value,
							validationResult: value.validationResult,
							isFocused: true,
						};
					}
					return value;
			  });
		setAnswer({
			questionID: docID,
			values: newValue,
		});
	};

	const handleBlur = (e: any, item: (typeof options)[0]) => {
		const value = e.target.value;
		if (value === FORMAT_MASK_RU || value === FORMAT_MASK_EN) {
			const prevValue = values.filter(v => v.optionID !== item.docID);
			setAnswer({
				questionID: docID,
				values: prevValue,
			});
			return;
		}

		const validationResult = validation({
			value,
			simpleType: "datetime",
			isSimpleDateLimit: true,
			simpleDateMin,
			simpleDateMax,
			locale,
		});

		const needChangeValue =
			validationResult.message !== "validMessageDateFormat";

		const newValue = values.map(v => {
			if (v.optionID === item.docID) {
				return {
					optionID: v.optionID,
					value: needChangeValue ? value : "",
					validationResult: validationResult,
					isFocused: false,
				};
			}
			return v;
		});
		setAnswer({ questionID: docID, values: newValue });
	};

	const [minDate, maxDate] = getDateRange({
		isSimpleDateLimit,
		dateType: dateType as number,
		simpleDateMax,
		simpleDateMin,
		locale,
	});

	const extraProps = locale === "ru" ? { localeText: ruLocale } : {};

	return (
		<LocalizationProvider
			dateAdapter={AdapterDayjs}
			adapterLocale={locale}
			{...extraProps}
		>
			<div css={dateListCss}>
				{options.map((item, i) => {
					const answer = userAnswer?.values.find(
						answer => answer.optionID === item.docID
					);
					const answerExist = Boolean(answer && userAnswerExist);
					const value = answer ? answer.value : null;
					const showAlert =
						answerExist &&
						!answer!.validationResult.isValid &&
						!answer!.isFocused;
					const validationResult = userAnswerExist
						? userAnswer.values[0].validationResult
						: { isValid: true, message: "" };
					const parsedValue = dateParserForDayjs(value, locale);
					return (
						<FormControl key={item.docID} css={freeListItemCss}>
							<FormLabel component="legend" css={freeListItemLabelCss}>
								{item.title}
							</FormLabel>
							<div css={textFieldWrapperCss(showAlert)}>
								<MuiDatePicker
									views={["year", "month", "day"]}
									value={parsedValue}
									onChange={value => onChange(value, item)}
									dayOfWeekFormatter={(_day, weekday) =>
										`${weekday!.format("dd")}`
									}
									css={datePickerCss}
									minDate={minDate}
									maxDate={maxDate}
									format={locale === "en" ? "MM.DD.YYYY" : "DD.MM.YYYY"}
									slotProps={{
										textField: {
											helperText: "",
											focused: false,
											fullWidth: true,
											onFocus: e => handleFocus(e, item),
											onBlur: e => handleBlur(e, item),
										},
									}}
								/>
								{showAlert && (
									<div css={alertCss}>
										<ErrorComponent validationResult={validationResult} />
									</div>
								)}
							</div>
						</FormControl>
					);
				})}
			</div>
		</LocalizationProvider>
	);
};

export default DatePickerListView;
