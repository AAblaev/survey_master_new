import { css } from "@emotion/react";

const getGridTemplateColumnsValue = (columnsCount: number) => {
  let result = "";
  for (let i = 0; i < columnsCount; i++) {
    result += "1fr ";
  }
  return result;
};

const formGroupMobileCss = css`
  &.MuiFormGroup-root {
    display: grid;
    grid-template-columns: 1fr;
  }
`;
const formGroupDesctopCss = (columnsCount: number) => css`
  &.MuiFormGroup-root {
    display: grid;
    grid-template-columns: ${getGridTemplateColumnsValue(columnsCount)};
  }
`;
export const formGroupCss = (columnsCount: number) => css`
  ${formGroupMobileCss}
  @media (min-width: 576px) {
    ${formGroupMobileCss}
  }

  @media (min-width: 768px) {
    ${formGroupDesctopCss(columnsCount)}
  }

  @media (min-width: 992px) {
    ${formGroupDesctopCss(columnsCount)}
  }

  @media (min-width: 1200px) {
    ${formGroupDesctopCss(columnsCount)}
  }

  @media (min-width: 1400px) {
    ${formGroupDesctopCss(columnsCount)}
  }
`;
