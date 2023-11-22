import { css } from "@emotion/react";

export const thRowMobileCss = css`
  padding: 0px;
  text-align: left;
  padding: 0px;
  font-weight: 600;
`;

export const thColumnCss = css`
  font-weight: normal;
  padding: 10px;
  max-width: 100px;
  text-align: start;
  overflow-wrap: anywhere;
`;

export const headerColumnCss = css`
  font-weight: normal;
  padding: 0px 10px;
  text-align: start;
  overflow-wrap: anywhere;
`;

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

export const gridCss = css`
  display: grid;
  // grid-template-rows: repeat(auto-fit, minmax(150px, 1fr));
  grid-auto-rows: minmax(50px, auto);
`;

export const rowCss = css`
  display: grid;

  @media (min-width: 576px) {
    grid-template-columns: 1fr;
    grid-gap: 4px;
  }

  @media (min-width: 768px) {
    grid-template-columns: 250px repeat(auto-fit, minmax(50px, 1fr));
    grid-gap: 0px;
  }

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 250px repeat(auto-fit, minmax(50px, 1fr));
    grid-gap: 0px;
  }

  @media (min-width: 1200px) {
    display: grid;
    grid-template-columns: 250px repeat(auto-fit, minmax(50px, 1fr));
    grid-gap: 0px;
  }

  @media (min-width: 1400px) {
    grid-template-columns: 250px repeat(auto-fit, minmax(50px, 1fr));
    grid-gap: 0px;
  }
`;

export const headerCss = css`
  display: none;
  font-weight: bold;
  grid-template-columns: 250px repeat(auto-fit, minmax(50px, 1fr));
  grid-gap: 4px;

  @media (min-width: 576px) {
    display: none;
  }

  @media (min-width: 768px) {
    display: grid;
  }

  @media (min-width: 992px) {
    display: grid;
  }

  @media (min-width: 1200px) {
    display: grid;
  }

  @media (min-width: 1400px) {
    display: grid;
  }
`;

export const cellCss = css`
  display: flex;
  align-items: stretch;
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

export const tableCss = css`
  &.MuiTable-root {
    width: auto;
    max-width: 99%;
    // min-width: 700px;
  }
  position: relative;
  z-index: 2;
  overflow: hidden;
`;

export const tableHeaderColumnCss = (firstColumnWidth: number) => css`
  width: ${firstColumnWidth}px;
  &.MuiTableCell-root {
    border: none;
    padding: 0px;
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

export const tableFirstColumnCellCss = css`
  &.MuiTableCell-root {
    border: none;
    padding: 0px;
    line-height: 1;
    position: relative;
    z-index: auto;
  }
`;

export const tableRowCss = (showHoverEffect: boolean) => css`
  &.MuiTableRow-root:hover {
    background-color: ${showHoverEffect ? "#f2f2f2" : "transparent"};
  }
`;

export const tableCellCss = (showHoverEffect: boolean) => css`
  &.MuiTableCell-root {
    border: none;
    padding: 0px;
    line-height: 1;
    position: relative;
    z-index: auto;
  }

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

// table
// .MuiTable-root {
//     width: 100%;
//     display: table;
//     border-spacing: 0;
//     border-collapse: collapse;
// }
// .css-mz9r2d-tableCss {
//     position: relative;
//     z-index: 2;
//     overflow: hidden;
// }
// .css-mz9r2d-tableCss.MuiTable-root {
//     width: auto;
//     max-width: 99%;
//     min-width: 700px;
// }
//////////////////////////////////////////////////

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

// thead
// .MuiTableHead-root {
//     display: table-header-group;
// }
//
// thead {
//     display: table-header-group;
//     vertical-align: middle;
//     border-color: inherit;
// }

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
//tr
// tr {
//     display: table-row;
//     vertical-align: inherit;
//     border-color: inherit;
// }

export const new_headerRowCss = css`
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
`;

//th
// .css-1mq3uyd-tableHeaderColumnCss.MuiTableCell-root {
//     border: none;
//     padding: 0px;
// }
//
// .MuiTableCell-head {
//     color: rgba(0, 0, 0, 0.87);
//     font-weight: 500;
//     line-height: 1.5rem;
// }
//
// .MuiTableCell-root {
//     color: inherit;
//     display: table-cell;
//     padding: 16px;
//     font-size: 0.84rem;
//     text-align: left;
//     font-family: -apple-system,BlinkMacSystemFont,Montserrat,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,Arial,sans-serif;
//     font-weight: 400;
//     line-height: 1.43;
//     border-bottom: 1px solid
//     rgba(224, 224, 224, 1);
//     vertical-align: inherit;
// }
//
// .css-1mq3uyd-tableHeaderColumnCss {
//     width: 250px;
// }
// th {
//     display: table-cell;
//     vertical-align: inherit;
//     font-weight: bold;
//     text-align: -internal-center;
// }
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

/////////////////////////////

//tbody
// .MuiTableBody-root {
//     display: table-row-group;
// }
// tbody {
//     display: table-row-group;
//     vertical-align: middle;
//     border-color: inherit;
// }

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

//tr
// tr {
//     display: table-row;
//     vertical-align: inherit;
//     border-color: inherit;
// }
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
//th
// .css-94pmez-tableFirstColumnCellCss.MuiTableCell-root {
//     border: none;
//     padding: 0px;
//     line-height: 1;
//     position: relative;
//     z-index: auto;
// }
//
// .MuiTableCell-body {
//     color: rgba(0, 0, 0, 0.87);
// }
// .MuiTableCell-root {
//     color: inherit;
//     display: table-cell;
//     padding: 16px;
//     font-size: 0.84rem;
//     text-align: left;
//     font-family: -apple-system,BlinkMacSystemFont,Montserrat,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,Arial,sans-serif;
//     font-weight: 400;
//     line-height: 1.43;
//     border-bottom: 1px solid
//     rgba(224, 224, 224, 1);
//     vertical-align: inherit;
// }
//
// th {
//     display: table-cell;
//     vertical-align: inherit;
//     font-weight: bold;
//     text-align: -internal-center;
// }

export const new_tableFirstColumnCellCss = css`
  display: table-cell;
  vertical-align: inherit;
  font-weight: bold;
  text-align: -internal-center;

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

//td
// .css-h0a9hb-tableCellCss.MuiTableCell-root {
//     border: none;
//     padding: 0px;
//     line-height: 1;
//     position: relative;
//     z-index: auto;
// }
// .MuiTableCell-body {
//     color: rgba(0, 0, 0, 0.87);
// }
// .MuiTableCell-root {
//     color: inherit;
//     display: table-cell;
//     padding: 16px;
//     font-size: 0.84rem;
//     text-align: left;
//     font-family: -apple-system,BlinkMacSystemFont,Montserrat,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,Arial,sans-serif;
//     font-weight: 400;
//     line-height: 1.43;
//     border-bottom: 1px solid
//     rgba(224, 224, 224, 1);
//     vertical-align: inherit;
// }
//     display: table-cell;
//     vertical-align: inherit;

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
