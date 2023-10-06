import {
  IBackendAnswer,
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
}): IValidationResult => {
  const {
    value,
    simpleType,
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
  } = payload;

  // check empty value
  if (value === "") return { isValid: false, message: "пусто" };

  // check type
  if (simpleType === "boolean") return { isValid: true, message: "success" };

  if (simpleType === "datetime" && !isValidDate(value)) {
    return { isValid: false, message: "допустимый формат дд.мм.гггг" };
  }

  if (simpleType === "string" && false) {
    return { isValid: false, message: "пусто" };
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

  if (isLimitedValue && simpleType === "datetime") {
    const valueDateArr = value.split(".");
    const valueDate = new Date(
      Number(valueDateArr[2]),
      Number(valueDateArr[1]) - 1,
      Number(valueDateArr[0])
    );
    const minDate = new Date(String(limitValue!.min));
    const maxDate = new Date(String(limitValue!.max));

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

    if (minDate > valueDate)
      return {
        isValid: false,
        message: `значение не может быть меньше ${minDateStr}`,
      };

    if (maxDate < valueDate)
      return {
        isValid: false,
        message: `значение не может быть больше ${maxDateStr}`,
      };
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
  // console.log("backendAnswers", backendAnswers);
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
