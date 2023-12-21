import { css } from "@emotion/react";
//
// export const thColumnCss = css`
//   font-weight: normal;
//   padding: 10px;
//   max-width: 100px;
//   text-align: start;
//   overflow-wrap: anywhere;
// `;

export const tdMobileCss = (isSelected: boolean, content: string) => css`
  display: flex;
  cursor: pointer;
  padding: 0.5rem;
  border: 1px solid #e5e5e5;
  width: 100%;


  ${isSelected && "background-color: #e5e5e5;"}
  & > .MuiButtonBase-root {
    display: none;
  }

  &::after {
    color:  black;
    content: '${content}';
  }

`;

export const tdDesctopCss = css`
  background-color: transparent;
  border: 1px solid #e5e5e5;

  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  & > .MuiButtonBase-root {
    display: inline-block;
  }
  &::after {
    content: "";
  }
`;

export const tdCss = (
  mobileTabularView: boolean,
  isSelected: boolean,
  content: string
) => css`
  font-weight: normal;

  ${mobileTabularView ? tdDesctopCss : tdMobileCss(isSelected, content)}
  @media (min-width: 576px) {
    ${mobileTabularView ? tdDesctopCss : tdMobileCss(isSelected, content)}
  }

  @media (min-width: 768px) {
    ${tdDesctopCss}
  }

  @media (min-width: 992px) {
    ${tdDesctopCss}
  }

  @media (min-width: 1200px) {
    ${tdDesctopCss}
  }

  @media (min-width: 1400px) {
    ${tdDesctopCss}
  }
`;

export const wrapperCss = css`
  padding-bottom: 20px;
`;

export const gridTextFieldCellCss = css`
  display: flex;
  align-items: stretch;
  // width: 100%;
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // right: 0;
  // left: 0;
  // padding: 5px 0;
`;

export const titleTextFieldCellCss = (mobileTabularView: boolean) => css`
  display: ${!mobileTabularView ? "flex" : "none"};
  align-items: center;
  width: 30%;
  margin-right: 5px;
  @media (min-width: 576px) {
    display: ${!mobileTabularView ? "flex" : "none"};
    width: 30%;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

export const borderColorMatrixCss = (alarm: boolean) => css`
  & .MuiFilledInput-root {
    ${alarm && `border-color:red`}
  }

  & .MuiFilledInput-multiline {
    padding: 0px;
  }

  & > .MuiInputBase-root {
    display: flex;
    align-items: flex-start;
  }
`;

export const tableHeaderCellCss = css`
  display: table-cell;
  border: none;
  padding: 10px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
  line-height: 1.5rem;
  font-size: 0.84rem;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, Montserrat, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Arial,
    sans-serif;
  line-height: 1.43;
  vertical-align: inherit;
  max-width: 200px;
`;

export const onlyDesctopRender = css`
  display: none;

  @media (min-width: 576px) {
    display: none;
  }

  @media (min-width: 768px) {
    display: block;
  }

  @media (min-width: 992px) {
    display: block;
  }

  @media (min-width: 1200px) {
    display: block;
  }

  @media (min-width: 1400px) {
    display: block;
  }
`;

export const onlyMobileRender = css`
  display: block;

  @media (min-width: 576px) {
    display: block;
  }

  @media (min-width: 768px) {
    display: none;
  }

  @media (min-width: 992px) {
    display: none;
  }

  @media (min-width: 1200px) {
    display: none;
  }

  @media (min-width: 1400px) {
    display: none;
  }
`;

export const onlyDesctopTable = css`
  display: flex;
  flex-direction: column;

  @media (min-width: 576px) {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    display: table;
    min-width: 700px;
  }

  @media (min-width: 992px) {
    display: table;
    min-width: 700px;
  }

  @media (min-width: 1200px) {
    display: table;
    min-width: 700px;
  }
  @media (min-width: 1400px) {
    display: table;
    min-width: 700px;
  }
`;

export const new_tableCss = (mobileTabularView: boolean) => css`
  display: table;
  width: auto;
  border-spacing: 0;
  border-collapse: collapse;
  position: relative;
  z-index: 2;
  overflow: hidden;
  max-width: 99%;

  ${!mobileTabularView && onlyDesctopTable}
`;

export const onlyDesctopTHead = css`
  display: none;

  @media (min-width: 576px) {
    display: none;
  }

  @media (min-width: 768px) {
    display: table-header-group;
  }

  @media (min-width: 992px) {
    display: table-header-group;
  }

  @media (min-width: 1200px) {
    display: table-header-group;
  }

  @media (min-width: 1400px) {
    display: table-header-group;
  }
`;

export const new_theadCss = (mobileTabularView: boolean) => css`
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
  ${!mobileTabularView && onlyDesctopTHead}
`;

export const new_headerRowCss = css`
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
`;

export const new_headerFirstColumnCellCss = (firstColumnWidth: number) => css`
  display: table-cell;
  width: ${firstColumnWidth}px;
  border: none;
  padding: 0px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
  line-height: 1.5rem;
  font-size: 0.84rem;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, Montserrat, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Arial,
    sans-serif;
  line-height: 1.43;
  color: rgba(224, 224, 224, 1);
  vertical-align: inherit;
`;

export const onlyDesctopTBody = css`
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media (min-width: 576px) {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    display: table-row-group;
  }

  @media (min-width: 992px) {
    display: table-row-group;
  }

  @media (min-width: 1200px) {
    display: table-row-group;
  }
  @media (min-width: 1400px) {
    display: table-row-group;
  }
`;

export const tbodyCss = (mobileTabularView: boolean) => css`
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
  ${!mobileTabularView && onlyDesctopTBody}
`;

export const onlyDesctopTRow = (showHoverEffect: boolean) => css`
  display: flex;
  flex-direction: column;
  // align-items: center;
  &:hover {
    background-color: transparent;
  }

  @media (min-width: 576px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    &:hover {
      background-color: transparent;
    }
  }

  @media (min-width: 768px) {
    display: table-row;
    &:hover {
      background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
    }
  }

  @media (min-width: 992px) {
    display: table-row;
    &:hover {
      background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
    }
  }

  @media (min-width: 1200px) {
    display: table-row;
    &:hover {
      background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
    }
  }
  @media (min-width: 1400px) {
    display: table-row;
    &:hover {
      background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
    }
  }
`;

export const trCss = (
  mobileTabularView: boolean,
  showHoverEffect: boolean
) => css`
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
  &:hover {
    background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
  }
  ${!mobileTabularView && onlyDesctopTRow(showHoverEffect)}
`;

export const new_tableFirstColumnCellCss = (firstColumnWidth: number) => css`
  display: table-cell;
  vertical-align: inherit;
  font-weight: bold;
  text-align: -internal-center;
  width: ${firstColumnWidth}px;
  color: inherit;
  display: table-cell;
  padding: 16px;
  font-size: 0.84rem;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, Montserrat, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Arial,
    sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.43;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  vertical-align: inherit;

  color: rgba(0, 0, 0, 0.87);
  border: none;
  padding: 0px;
  line-height: 1;
  position: relative;
  z-index: auto;
`;

export const onlyDesctopTableCell = (
  mobileTabularView: boolean,
  showHoverEffect: boolean
) => css`
  &:hover::before {
    content: "";
    background-color: transparent;
    position: absolute;
    height: 2000px;
    width: 100%;
    left: 0;
    top: -1000px;
    z-index: -1;
  }
  @media (min-width: 576px) {
    &:hover::before {
      content: "";
      background-color: transparent;
      position: absolute;
      height: 2000px;
      width: 100%;
      left: 0;
      top: -1000px;
      z-index: -1;
    }
  }

  @media (min-width: 768px) {
    &:hover::before {
      content: "";
      background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
      position: absolute;
      height: 2000px;
      width: 100%;
      left: 0;
      top: -1000px;
      z-index: -1;
    }
  }

  @media (min-width: 992px) {
    &:hover::before {
      content: "";
      background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
      position: absolute;
      height: 2000px;
      width: 100%;
      left: 0;
      top: -1000px;
      z-index: -1;
    }
  }

  @media (min-width: 1200px) {
    &:hover::before {
      content: "";
      background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
      position: absolute;
      height: 2000px;
      width: 100%;
      left: 0;
      top: -1000px;
      z-index: -1;
    }
  }
  @media (min-width: 1400px) {
    &:hover::before {
      content: "";
      background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
      position: absolute;
      height: 2000px;
      width: 100%;
      left: 0;
      top: -1000px;
      z-index: -1;
    }
  }
`;
export const new_tableCellCss = (
  mobileTabularView: boolean,
  showHoverEffect: boolean
) => css`
  display: table-cell;
  vertical-align: inherit;
  color: inherit;
  display: table-cell;
  padding: 16px;
  font-size: 0.84rem;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, Montserrat, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Arial,
    sans-serif;
  font-weight: 400;
  line-height: 1.43;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  vertical-align: inherit;
  color: rgba(0, 0, 0, 0.87);
  border: none;
  padding: 0px;
  line-height: 1;
  position: relative;
  z-index: auto;
  &:hover::before {
    content: "";
    background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
    position: absolute;
    height: 2000px;
    width: 100%;
    left: 0;
    top: -1000px;
    z-index: -1;
  }
  ${!mobileTabularView &&
  onlyDesctopTableCell(mobileTabularView, showHoverEffect)}
`;
