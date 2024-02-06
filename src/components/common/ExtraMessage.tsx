import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useRef } from "react";
import { IConfig } from "../../types";
import { limitMessageCss, limitMessageWrapperCss } from "../questions/sc";
import ErrorIcon from "@mui/icons-material/Error";
import { css } from "@emotion/react";
import { getDateRangeMessage } from "../../utils/dateParser";

type IExtraMessageProps = {
  config: IConfig;
  needCorrect: boolean;
  hasRequiredRowsAndColumns: boolean;
};

export const alertCss = css`
  position: absolute;
  top: -10px;
  right: -40px;
  z-index: 1000000000;
`;

const ExtraMessage: React.FC<IExtraMessageProps> = ({
  config,
  needCorrect,
  hasRequiredRowsAndColumns,
}) => {
  const {
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
    dataType,
    dateType,
    requiredRowsCount,
    requiredColunmsCount,
    simpleType,
    options,
    isRequired,
    isSimpleDateLimit,
    simpleDateMax,
    simpleDateMin,
  } = config;

  // isRequired

  const getExtraText = () => {
    let result = "";

    if (simpleType === "integer") {
      result += `Текст ответа должен быть целым числом. `;
    }
    if (simpleType === "float") {
      result += `Текст ответа должен быть числом в формате 0.00. `;
    }

    if (simpleType === "datetime") {
      result += `Ответ должен быть в формате ДД.ММ.ГГГГ. `;
    }
    if (isLimited) {
      result += `Длина текста должна составлять не менее ${limit?.min} и не более ${limit?.max} символов. `;
    }
    if (isLimitedValue) {
      result += `Значение числа должно быть не менее ${limitValue?.min} и не более ${limitValue?.max}. `;
    }

    if (isSimpleDateLimit) {
      result += `Значение должно быть не менее ${
        simpleDateMin!.split(" ")[0]
      } и не более ${simpleDateMax!.split(" ")[0]}. `;
    } else {
      result += getDateRangeMessage(dateType as number);
    }

    if (dataType === "freelist" && isRequired) {
      const rowsCount = options!.filter((option) => option.dimension === 0)
        .length;

      const allRowsAreRequired =
        requiredRowsCount === 0 || requiredRowsCount === rowsCount;

      result += allRowsAreRequired
        ? `Необходимо ответить на все строки. `
        : `Минимальное количество строк, на которые нужно дать ответ - ${requiredRowsCount}.`;
    }

    if (dataType === "matrix" && isRequired) {
      const columnsCount = options!.filter((option) => option.dimension === 1)
        .length;

      const rowsCount = options!.filter((option) => option.dimension === 0)
        .length;

      const allColumnsAreRequired =
        requiredColunmsCount === 0 || requiredColunmsCount === columnsCount;
      const allRowsAreRequired =
        requiredRowsCount === 0 || requiredRowsCount === rowsCount;

      if (allColumnsAreRequired && allRowsAreRequired) {
        result += `Необходимо ответить на все строки и все колонки. `;
        return result;
      }

      if (requiredRowsCount === 1 && requiredColunmsCount === 1) {
        result += `Необходимо ответить минимум на 1 строку.`;
        return result;
      }

      if (requiredRowsCount === 1) {
        result += allColumnsAreRequired
          ? `Необходимо ответить на все колонки.`
          : `Минимальное количество колонок, на которые нужно дать ответ - ${requiredColunmsCount}`;
        return result;
      }

      if (requiredColunmsCount === 1) {
        result += allRowsAreRequired
          ? `Необходимо ответить на все строки.`
          : `Минимальное количество строк, на которые нужно дать ответ - ${requiredRowsCount}`;
        return result;
      }
    }
    return result;
  };

  const text = getExtraText();
  if (text === "") return null;

  return (
    <div css={limitMessageWrapperCss}>
      <div css={limitMessageCss}>{text}</div>
      {needCorrect && !hasRequiredRowsAndColumns && (
        <div css={alertCss}>
          <Tooltip title={"проверьте выполнение условия"}>
            <IconButton>
              <ErrorIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );

  // if (dataType === "free") {
  //   return (
  //     <div css={limitMessageWrapperCss}>
  //       {isLimited && (
  //         <span
  //           css={limitMessageCss}
  //         >{`Длина текста должна составлять не менее ${limit?.min} и не более ${limit?.max} символов. `}</span>
  //       )}
  //
  //       {!isLimitedValue &&
  //         (simpleType === "integer" || simpleType === "float") && (
  //           <span css={limitMessageCss}>
  //             {`Текст ответа должен быть ${
  //               simpleType === "integer" ? "целым " : ""
  //             }числом${simpleType === "float" ? " в формате 0.00" : ""}.`}
  //           </span>
  //         )}
  //
  //       {isLimitedValue && (
  //         <span css={limitMessageCss}>
  //           {`Текст ответа должен быть ${
  //             simpleType === "integer" ? `целым ` : ""
  //           }числом${
  //             simpleType === "float" ? ` в формате 0.00` : ""
  //           }. Значение числа должно быть не менее ${
  //             limitValue?.min
  //           } и не более ${limitValue?.max}.`}
  //         </span>
  //       )}
  //     </div>
  //   );
  // }
  //
  // if (dataType === "freelist") {
  //   const rowsCount = options!.filter((option) => option.dimension === 0)
  //     .length;
  //
  //   const allRowsAreRequired =
  //     requiredRowsCount === 0 || requiredRowsCount === rowsCount;
  //
  //   if (allRowsAreRequired) {
  //     return (
  //       <div css={limitMessageWrapperCss}>
  //         <span
  //           css={limitMessageCss}
  //         >{`Необходимо ответить на все строки.`}</span>
  //       </div>
  //     );
  //   }
  //
  //   return (
  //     <div css={limitMessageWrapperCss}>
  //       <span
  //         css={limitMessageCss}
  //       >{`Минимальное количество строк, на которые нужно дать ответ - ${requiredRowsCount}.`}</span>
  //     </div>
  //   );
  // }
  //
  // if (dataType === "matrix") {
  //   const columnsCount = options!.filter((option) => option.dimension === 1)
  //     .length;
  //
  //   const rowsCount = options!.filter((option) => option.dimension === 0)
  //     .length;
  //
  //   const allColumnsAreRequired =
  //     requiredColunmsCount === 0 || requiredColunmsCount === columnsCount;
  //   const allRowsAreRequired =
  //     requiredRowsCount === 0 || requiredRowsCount === rowsCount;
  //
  //   if (allColumnsAreRequired && allRowsAreRequired) {
  //     return (
  //       <div css={limitMessageWrapperCss}>
  //         <span
  //           css={limitMessageCss}
  //         >{`Необходимо ответить на все строки и все колонки.`}</span>
  //       </div>
  //     );
  //   }
  //
  //   if (requiredRowsCount === 1 && requiredColunmsCount === 1) {
  //     return (
  //       <div css={limitMessageWrapperCss}>
  //         <span
  //           css={limitMessageCss}
  //         >{`Необходимо ответить минимум на 1 строку.`}</span>
  //       </div>
  //     );
  //   }
  //
  //   if (requiredRowsCount === 1) {
  //     return (
  //       <div css={limitMessageWrapperCss}>
  //         <span css={limitMessageCss}>
  //           {allColumnsAreRequired
  //             ? `Необходимо ответить на все колонки.`
  //             : `Минимальное количество колонок, на которые нужно дать ответ - ${requiredColunmsCount}`}
  //         </span>
  //       </div>
  //     );
  //   }
  //
  //   if (requiredColunmsCount === 1) {
  //     return (
  //       <div css={limitMessageWrapperCss}>
  //         <span css={limitMessageCss}>
  //           {allRowsAreRequired
  //             ? `Необходимо ответить на все строки.`
  //             : `Минимальное количество строк, на которые нужно дать ответ - ${requiredRowsCount}`}
  //         </span>
  //       </div>
  //     );
  //   }
  // }
  //
  // return null;
};

export default ExtraMessage;
// const extraMessage = "";
