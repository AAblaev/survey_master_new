import React from "react";
import { ruRU } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { IAnswer } from "../../../../types";
import { validation } from "../../../../utils/validation";
import { alertCss, textFieldWrapperCss } from "../free-list";
import {
	dateParser,
	dateParserForDayjs,
	getDateRange,
} from "../../../../utils/dateParser";
import { IViewComponentProps } from "../..";
import { FORMAT_MASK_EN, FORMAT_MASK_RU } from "./const";
import ErrorComponent from "../../../common/ErrorComponent";
import { datePickerCss } from "./sc";

const ruLocale =
	ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

const DatePicker: React.FC<IViewComponentProps> = ({
	question,
	setAnswer,
	userAnswer,
	locale,
}) => {
	// const locale = "en";
	// console.log("DatePicker locale", locale);

	const { docID, config } = question;
	const { isSimpleDateLimit, simpleDateMax, simpleDateMin, dateType } = config;
	// const { simpleDateMax, simpleDateMin, dateType } = config;
	// const isSimpleDateLimit = false;
	// console.log("_________________________________________");
	// console.log("isSimpleDateLimit", isSimpleDateLimit);
	// console.log("simpleDateMin", simpleDateMin);
	// console.log("simpleDateMax", simpleDateMax);
	// console.log("dateType", dateType);

	const userAnswerExist = userAnswer && userAnswer.values.length > 0;
	const showAlert =
		userAnswerExist &&
		!userAnswer.values[0].validationResult.isValid &&
		!userAnswer.values[0].isFocused;

	const validationResult = userAnswerExist
		? userAnswer.values[0].validationResult
		: { isValid: true, message: "" };
	const value = userAnswerExist
		? (userAnswer.values as IAnswer["values"])[0].value
		: null;

	const parsedValue = dateParserForDayjs(value, locale);

	// const minDate = isSimpleDateLimit
	//   ? dateParserForDayjs(simpleDateMin!.split(" ")[0])
	//   : dayjs("1000-01-01");
	// const maxDate = isSimpleDateLimit
	//   ? dateParserForDayjs(simpleDateMax!.split(" ")[0])
	//   : dayjs("2100-12-31");

	const [minDate, maxDate] = getDateRange({
		isSimpleDateLimit,
		dateType: dateType as number,
		simpleDateMax,
		simpleDateMin,
		locale,
	});

	// console.log("minDate", minDate);
	// console.log("maxDate", maxDate);
	// console.log("_________________________________________");

	const onChange = (newValue: dayjs.Dayjs | null) => {
		const value_str =
			dateParser(newValue ? newValue.toDate() : null, locale) ?? "";

		if (
			userAnswerExist &&
			(userAnswer.values as IAnswer["values"])[0].isFocused
		)
			return;

		const validationResult = validation({
			value: value_str,
			simpleType: "datetime",
			isSimpleDateLimit,
			simpleDateMin: (minDate as dayjs.Dayjs).format("DD.MM.YYYY HH:mm:ss"),
			simpleDateMax: (maxDate as dayjs.Dayjs).format("DD.MM.YYYY HH:mm:ss"),
			locale,
		});

		setAnswer({
			questionID: docID,
			values: [
				{
					value: value_str,
					optionID: 0,
					isFocused: false,
					validationResult: validationResult,
				},
			],
		});
	};

	const handleFocus = (e: any) => {
		const isValid =
			userAnswerExist && userAnswer.values[0].validationResult.isValid;
		setAnswer({
			questionID: docID,
			values: [
				{
					value: value ? value : "",
					optionID: 0,
					isFocused: true,
					validationResult: { isValid: isValid, message: "ошибка" },
				},
			],
		});
	};

	const handleBlur = (e: any) => {
		const value = e.target.value;

		if (value === FORMAT_MASK_RU || value === FORMAT_MASK_EN) {
			setAnswer({
				questionID: docID,
				values: [],
			});
			return;
		}
		const validationResult = validation({
			value,
			simpleType: "datetime",
			isSimpleDateLimit,
			simpleDateMin: (minDate as dayjs.Dayjs).format("DD.MM.YYYY HH:mm:ss"),
			simpleDateMax: (maxDate as dayjs.Dayjs).format("DD.MM.YYYY HH:mm:ss"),
			locale,
		});

		const needChangeValue =
			validationResult.message !== "validMessageDateFormat";
		setAnswer({
			questionID: docID,
			values: [
				{
					value: needChangeValue ? value : "",
					optionID: 0,
					isFocused: false,
					validationResult,
				},
			],
		});
	};

	const extraProps = locale === "ru" ? { localeText: ruLocale } : {};

	return (
		<div css={textFieldWrapperCss}>
			<LocalizationProvider
				dateAdapter={AdapterDayjs}
				adapterLocale={locale}
				{...extraProps}
			>
				<MuiDatePicker
					views={["year", "month", "day"]}
					value={parsedValue}
					onChange={newValue => onChange(newValue)}
					dayOfWeekFormatter={(_day, weekday) => `${weekday!.format("dd")}`}
					minDate={minDate}
					maxDate={maxDate}
					format={locale === "en" ? "MM.DD.YYYY" : "DD.MM.YYYY"}
					slotProps={{
						textField: {
							helperText: "",
							focused: false,
							fullWidth: true,
							onFocus: e => handleFocus(e),
							onBlur: e => handleBlur(e),
						},
					}}
					css={datePickerCss}
				/>
			</LocalizationProvider>

			{showAlert && (
				<div css={alertCss}>
					<ErrorComponent validationResult={validationResult} />
				</div>
			)}
		</div>
	);
};

export default DatePicker;
