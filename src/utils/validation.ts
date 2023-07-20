import { ISimpleType } from "../types";

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
