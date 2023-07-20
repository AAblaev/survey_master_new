import { ISimpleType } from "../types";

export const convertToNumberOrString = (value: string): boolean => {
  const parsedValue = parseFloat(value);

  if (!isNaN(parsedValue)) {
    return true; // Возвращает число типа number, если преобразование удалось
  }
  return false;
};

export const answerValidation = (value: string, type: ISimpleType): boolean => {
  return false;
};
