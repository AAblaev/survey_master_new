import {
	IAnswer,
	IBackendAnswer,
	IConfig,
	ILanguage,
	IQuestion,
	ISimpleType,
	IUserAnswer,
	IValidationResult,
	IValue,
} from "../types";

type IKeyRegExpDict = Exclude<ISimpleType, "boolean">;

export const REGEXP_DICT: { [key in IKeyRegExpDict]: RegExp } = {
	string: /^.+$/,
	datetime: /^(0[1-9]|1\d|2\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/,
	float: /^[-]?[0-9]*\.?[0-9]*$/,
	integer: /^-?\d+$/,
};

export const isValidDate = (dateString: string, locale: ILanguage): boolean => {
	const parts: string[] = dateString.split(".");
	const day: number =
		locale === "en" ? parseInt(parts[1], 10) : parseInt(parts[0], 10);
	const month: number =
		locale === "en" ? parseInt(parts[0], 10) : parseInt(parts[1], 10);

	// const day: number = parseInt(parts[0], 10);
	// const month: number = parseInt(parts[1], 10);

	const year: number = parseInt(parts[2], 10);
	const date: Date = new Date(year, month - 1, day);
	// console.log("dateString", dateString);
	// console.log("date", date);

	return (
		date.getDate() === day &&
		date.getMonth() === month - 1 &&
		date.getFullYear() === year
	);
};

export const isValidString = (value: string): boolean => {
	return REGEXP_DICT["string"].test(value);
};

export const isDateTime = (value: string): boolean => {
	return REGEXP_DICT["datetime"].test(value);
};

export const isInt = (value: string): boolean => {
	return REGEXP_DICT["integer"].test(value);
};

export const isFloat = (value: string): boolean => {
	return REGEXP_DICT["float"].test(value);
};

export const validation = (payload: {
	value: string;
	simpleType: ISimpleType;
	isLimited?: boolean;
	isLimitedValue?: boolean;
	limit?: {
		min: number;
		max: number;
	};
	limitValue?:
		| {
				min: number;
				max: number;
		  }
		| {
				min: string;
				max: string;
		  };
	isSimpleDateLimit?: boolean;
	simpleDateMin?: string;
	simpleDateMax?: string;
	locale?: ILanguage;
}): IValidationResult => {
	const {
		value,
		simpleType,
		isLimited,
		isLimitedValue,
		limit,
		limitValue,
		isSimpleDateLimit,
		simpleDateMin,
		simpleDateMax,
		locale,
	} = payload;

	// console.log("simpleDateMin!!!", simpleDateMin);
	// console.log("simpleDateMax!!!", simpleDateMax);

	// check empty value
	if (value === "") return { isValid: false, message: "validMessageEmpty" };

	// check type
	if (simpleType === "boolean") return { isValid: true, message: "success" };

	if (simpleType === "datetime" && !isValidDate(value, locale as ILanguage)) {
		return { isValid: false, message: "validMessageDateFormat" };
	}

	if (simpleType === "integer" && !isInt(value)) {
		return { isValid: false, message: "validMessageInteger" };
	}

	if (simpleType === "float" && !isFloat(value)) {
		return { isValid: false, message: "validMessageFloat" };
	}

	// check out of range

	if (isLimitedValue && (simpleType === "integer" || simpleType === "float")) {
		if ((limitValue!.min as number) > Number(value))
			return {
				isValid: false,
				message: `validMessageIntegerMin`,
				params: { value: String(limitValue!.min) },
			};

		if ((limitValue!.max as number) < Number(value))
			return {
				isValid: false,
				message: `validMessageIntegerMax`,
				params: { value: String(limitValue!.max) },
			};
	}

	if (isLimited && simpleType === "string") {
		if (limit!.min > value.length)
			return {
				isValid: false,
				message: `validMessageStringMin`,
				params: { value: String(limit!.min) },
			};

		if (limit!.max < value.length)
			return {
				isValid: false,
				message: `validMessageStringMax`,
				params: { value: String(limit!.max) },
			};
	}

	// check out of range datatime

	if (simpleType === "datetime") {
		const valueDateArr = value.split(".");
		const valueDate = new Date(
			Number(valueDateArr[2]),
			Number(valueDateArr[1]) - 1,
			Number(valueDateArr[0])
		);

		/// испавить

		// console.log("simpleDateMin", simpleDateMin);
		// console.log("simpleDateMax", simpleDateMax);

		const [minDay, minMonth, minYear] = simpleDateMin!.split(" ")[0].split(".");
		const [maxDay, maxMonth, maxYear] = simpleDateMax!.split(" ")[0].split(".");

		const minDate = new Date(
			Number(minYear),
			Number(minMonth) - 1,
			Number(minDay)
		);
		const maxDate = new Date(
			Number(maxYear),
			Number(maxMonth) - 1,
			Number(maxDay)
		);

		const minDateStr = minDate.toLocaleString("ru-RU", {
			year: "numeric",
			month: "numeric",
			day: "numeric",
		});
		const maxDateStr = maxDate.toLocaleString("ru-RU", {
			year: "numeric",
			month: "numeric",
			day: "numeric",
		});

		if (minDate > valueDate) {
			return {
				isValid: false,
				message: `validMessageIntegerMin`,
				params: { value: minDateStr },
			};
		}

		if (maxDate < valueDate) {
			return {
				isValid: false,
				message: `validMessageIntegerMax`,
				params: { value: maxDateStr },
			};
		}
	}

	return { isValid: true, message: "success" };
};

export const getTextFieldConfig = (simpleType?: ISimpleType) => {
	const defaultTextFieldConfig = {
		fullWidth: true,
		minRows: 2,
		regExp: /^.+$/,
		mask: "",
	};

	switch (simpleType) {
		case "string": {
			return defaultTextFieldConfig;
		}
		case "integer": {
			return {
				fullWidth: false,
				minRows: 1,
				regExp: /^\d+$/,
				mask: "",
			};
			// ^\d+$
		}
		case "float": {
			return {
				fullWidth: false,
				minRows: 1,
				regExp: /^[+-]?\d+(\.\d+)?$/,
				mask: "",
			};
			// ^[+-]?\d+(\.\d+)?$
		}
		case "datetime": {
			return {
				fullWidth: false,
				minRows: 1,
				regExp: /^(0[1-9]|1\d|2\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/,
				mask: "",
			};
			//^(0[1-9]|1\d|2\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$
		}

		default: {
			return defaultTextFieldConfig;
		}
	}
};

export const answersParsed = (
	backendAnswers: IBackendAnswer[]
): IUserAnswer => {
	const result: IUserAnswer = {};
	backendAnswers.forEach(backendAnswer => {
		const values: IValue[] = backendAnswer.values.map(v => ({
			...v,
			isFocused: false,
			validationResult: { isValid: true, message: "success" },
		}));

		result[backendAnswer.questionID] = {
			questionID: backendAnswer.questionID,
			values: values,
		};
	});

	return result;
};

const countUniqueValues = (
	objects: { [key: string]: any }[],
	field: string,
	value: number = 1
) => {
	const uniqueValuesSet = new Set();
	for (const obj of objects) {
		const value = obj[field];
		uniqueValuesSet.add(value);
	}

	return !(value > uniqueValuesSet.size);
};

export const requiredRowsEndColumnsChecking = (
	question: IQuestion,
	values: IAnswer["values"] = []
): boolean => {
	if (values.length === 0) return true;
	// console.log("values", values);
	const hasExtra =
		values.length > 0 &&
		(values[0].optionID === -1 ||
			values[0].optionID === -2 ||
			(values[0].optionID === -3 && values[0].value !== ""));
	//
	// console.log("values.values.length > 0", values.length > 0);
	// console.log("values[0].optionID === -1", values[0].optionID === -1);
	// console.log("values[0].optionID === -2", values[0].optionID === -1);
	// console.log(
	//   "values[0].optionID === -3 && values[0].value !== ",
	//   values[0].optionID === -3 && values[0].value !== ""
	// );
	//
	// console.log("hasExtra", hasExtra);

	if (hasExtra) return true;
	switch (question.config.dataType) {
		case "freelist": {
			const requiredRowsCount = question.config.requiredRowsCount
				? question.config.requiredRowsCount
				: question.config.options!.filter(option => option.dimension === 0)
						.length;
			return countUniqueValues(values, "optionID", requiredRowsCount);
		}
		case "matrix": {
			const requiredRowsCount = question.config.requiredRowsCount
				? question.config.requiredRowsCount
				: question.config.options!.filter(option => option.dimension === 0)
						.length;
			const requiredColunmsCount = question.config.requiredColunmsCount
				? question.config.requiredColunmsCount
				: question.config.options!.filter(option => option.dimension === 1)
						.length;
			const result =
				countUniqueValues(values, "dimension0", requiredRowsCount) &&
				countUniqueValues(values, "dimension1", requiredColunmsCount);
			// console.log("result", result);
			return result;
		}
	}

	return true;
};
