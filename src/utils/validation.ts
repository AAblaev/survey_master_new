import {
  IAnswer,
  IBackendAnswer,
  IConfig,
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

export const isValidDate = (dateString: string): boolean => {
  const parts: string[] = dateString.split(".");
  const day: number = parseInt(parts[0], 10);
  const month: number = parseInt(parts[1], 10);
  const year: number = parseInt(parts[2], 10);

  const date: Date = new Date(year, month - 1, day);

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
  } = payload;

  // check empty value
  if (value === "") return { isValid: false, message: "пусто" };

  // check type
  if (simpleType === "boolean") return { isValid: true, message: "success" };

  if (simpleType === "datetime" && !isValidDate(value)) {
    return { isValid: false, message: "допустимый формат дд.мм.гггг" };
  }

  if (simpleType === "integer" && !isInt(value)) {
    return { isValid: false, message: "ответ должен быть целым числом" };
  }

  if (simpleType === "float" && !isFloat(value)) {
    return { isValid: false, message: "ответ должен быть числом" };
  }

  // check out of range

  if (isLimitedValue && (simpleType === "integer" || simpleType === "float")) {
    if (limitValue!.min > Number(value))
      return {
        isValid: false,
        message: `значение не может быть меньше ${limitValue!.min}`,
      };

    if (limitValue!.max < Number(value))
      return {
        isValid: false,
        message: `значение не может быть больше ${limitValue!.max}`,
      };
  }

  if (isLimited && simpleType === "string") {
    if (limit!.min > value.length)
      return {
        isValid: false,
        message: `количесво символов в ответе не может быть меньше ${
          limit!.min
        }`,
      };

    if (limit!.max < value.length)
      return {
        isValid: false,
        message: `количесво символов в ответе не может быть больше ${
          limit!.max
        }`,
      };
  }

  // check out of range datatime

  if (isSimpleDateLimit && simpleType === "datetime") {
    const valueDateArr = value.split(".");
    const valueDate = new Date(
      Number(valueDateArr[2]),
      Number(valueDateArr[1]) - 1,
      Number(valueDateArr[0])
    );

    /// испавить

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

    // console.log(minDate);
    // console.log(maxDate);
    // console.log(valueDate);

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
        message: `значение не может быть меньше ${minDateStr}`,
      };
    }

    if (maxDate < valueDate) {
      return {
        isValid: false,
        message: `значение не может быть больше ${maxDateStr}`,
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
  backendAnswers.forEach((backendAnswer) => {
    const values: IValue[] = backendAnswer.values.map((v) => ({
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
  // console.log("value", value);
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
  const hasExtra =
    values.values.length > 0 &&
    (values[0].optionID === -1 ||
      values[0].optionID === -2 ||
      (values[0].optionID === -3 && values[0].value !== ""));
  if (hasExtra) return true;
  switch (question.config.dataType) {
    case "freelist": {
      return countUniqueValues(
        values,
        "optionID",
        question.config.requiredRowsCount
      );
    }
    case "matrix": {
      return (
        countUniqueValues(
          values,
          "dimension1",
          question.config.requiredRowsCount
        ) &&
        countUniqueValues(
          values,
          "dimension0",
          question.config.requiredColunmsCount
        )
      );
    }
  }

  return true;
};
