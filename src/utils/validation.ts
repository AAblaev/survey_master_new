import { ISimpleType } from "../types";

type IKeyRegExpDict = Exclude<ISimpleType, "boolean">;

export const REGEXP_DICT: { [key in IKeyRegExpDict]: RegExp } = {
  string: /^.+$/,
  datetime: /^(0[1-9]|1\d|2\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/,
  float: /^[+-]?\d+(\.\d+)?$/,
  int: /^-?\d+$/,
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
  return REGEXP_DICT["int"].test(value);
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
  limitValue?: {
    min: number;
    max: number;
  };
}): { result: boolean; message: string } => {
  const {
    value,
    simpleType,
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
  } = payload;

  // check empty value
  if (value === "") return { result: false, message: "пусто" };

  // check type
  if (simpleType === "boolean") return { result: true, message: "success" };

  if (simpleType === "datetime" && !isValidDate(value)) {
    return { result: false, message: "допустимый формат дд.мм.гггг" };
  }

  if (simpleType === "string" && !isValidString(value)) {
    return { result: false, message: "пусто" };
  }

  if (simpleType === "int" && !isInt(value)) {
    return { result: false, message: "ответ должен содержать целое число" };
  }

  if (simpleType === "float" && !isFloat(value)) {
    return { result: false, message: "ответ должен содержать число" };
  }

  // check out of range

  if (isLimitedValue && (simpleType === "int" || simpleType === "float")) {
    if (limitValue!.min > Number(value))
      return {
        result: false,
        message: "значение меньше допустимого диапазона",
      };

    if (limitValue!.max > Number(value))
      return {
        result: false,
        message: "значение больше допустимого диапазона",
      };
  }

  if (isLimited && simpleType === "string") {
    if (limit!.min > value.length)
      return {
        result: false,
        message: "значение меньше допустимого диапазона",
      };

    if (limit!.max > value.length)
      return {
        result: false,
        message: "значение больше допустимого диапазона",
      };
  }

  // check out of range datatime

  return { result: true, message: "success" };
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
    case "int": {
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
