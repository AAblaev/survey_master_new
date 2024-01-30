import React, { useEffect, useRef } from "react";
import { IConfig } from "../../types";
import { limitMessageCss, limitMessageWrapperCss } from "../questions/sc";

type IExtraMessageProps = {
  config: IConfig;
};

const ExtraMessage: React.FC<IExtraMessageProps> = ({ config }) => {
  const {
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
    dataType,
    requiredRowsCount,
    requiredColunmsCount,
    simpleType,
    options,
  } = config;

  if (dataType === "free") {
    return (
      <div css={limitMessageWrapperCss}>
        {isLimited && (
          <span
            css={limitMessageCss}
          >{`Длина текста должна составлять не менее ${limit?.min} и не более ${limit?.max} символов. `}</span>
        )}

        {!isLimitedValue &&
          (simpleType === "integer" || simpleType === "float") && (
            <span css={limitMessageCss}>
              {`Текст ответа должен быть ${
                simpleType === "integer" ? "целым " : ""
              }числом${simpleType === "float" ? " в формате 0.00" : ""}.`}
            </span>
          )}

        {isLimitedValue && (
          <span css={limitMessageCss}>
            {`Текст ответа должен быть ${
              simpleType === "integer" ? `целым ` : ""
            }числом${
              simpleType === "float" ? ` в формате 0.00` : ""
            }. Значение числа должно быть не менее ${
              limitValue?.min
            } и не более ${limitValue?.max}.`}
          </span>
        )}
      </div>
    );
  }

  if (dataType === "freelist") {
    const rowsCount = options!.filter((option) => option.dimension === 0)
      .length;

    const allRowsAreRequired =
      requiredRowsCount === 0 || requiredRowsCount === rowsCount;
    if (allRowsAreRequired) {
      return (
        <div css={limitMessageWrapperCss}>
          <span
            css={limitMessageCss}
          >{`Необходимо ответить на все строки.`}</span>
        </div>
      );
    }

    return (
      <div css={limitMessageWrapperCss}>
        <span
          css={limitMessageCss}
        >{`Минимальное количество строк, на которые нужно дать ответ - ${requiredRowsCount}.`}</span>
      </div>
    );
  }

  if (dataType === "matrix") {
    const columnsCount = options!.filter((option) => option.dimension === 1)
      .length;

    const rowsCount = options!.filter((option) => option.dimension === 0)
      .length;

    const allColumnsAreRequired =
      requiredColunmsCount === 0 || requiredColunmsCount === columnsCount;
    const allRowsAreRequired =
      requiredRowsCount === 0 || requiredRowsCount === rowsCount;

    if (allColumnsAreRequired && allRowsAreRequired) {
      return (
        <div css={limitMessageWrapperCss}>
          <span
            css={limitMessageCss}
          >{`Необходимо ответить на все строки и все колонки.`}</span>
        </div>
      );
    }

    if (requiredRowsCount === 1 && requiredColunmsCount === 1) {
      return (
        <div css={limitMessageWrapperCss}>
          <span
            css={limitMessageCss}
          >{`Необходимо ответить минимум на 1 строку.`}</span>
        </div>
      );
    }

    if (requiredRowsCount === 1) {
      return (
        <div css={limitMessageWrapperCss}>
          <span css={limitMessageCss}>
            {allColumnsAreRequired
              ? `Необходимо ответить на все колонки.`
              : `Минимальное количество колонок, на которые нужно дать ответ - ${requiredColunmsCount}`}
          </span>
        </div>
      );
    }

    if (requiredColunmsCount === 1) {
      return (
        <div css={limitMessageWrapperCss}>
          <span css={limitMessageCss}>
            {allRowsAreRequired
              ? `Необходимо ответить на все строки.`
              : `Минимальное количество строк, на которые нужно дать ответ - ${requiredRowsCount}`}
          </span>
        </div>
      );
    }
  }

  return null;
};

export default ExtraMessage;
// const extraMessage = "";
