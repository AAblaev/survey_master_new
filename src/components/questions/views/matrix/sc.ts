import { css } from "@emotion/react";

export const tbodyDesctopCss = css`
  display: table-row-group;
  vertical-align: middle;
`;

export const tbodyMobileCss = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const tbodyCss = css`
  ${tbodyMobileCss}
  @media (min-width: 576px) {
    ${tbodyMobileCss}
  }

  @media (min-width: 768px) {
    ${tbodyDesctopCss}
  }

  @media (min-width: 992px) {
    ${tbodyDesctopCss}
  }

  @media (min-width: 1200px) {
    ${tbodyDesctopCss}
  }

  @media (min-width: 1400px) {
    ${tbodyDesctopCss}
  }
`;

const tableMobileCss = css`
  display: block;
`;
const tableDesctopCss = css`
  display: table;
`;

export const tableCss = css`
  font-size: 0.84rem;
  border-spacing: 0px;
  border-collapse: collapse;
  ${tableMobileCss}

  @media (min-width: 576px) {
    ${tableMobileCss}
  }

  @media (min-width: 768px) {
    ${tableDesctopCss}
  }

  @media (min-width: 992px) {
    ${tableDesctopCss}
  }

  @media (min-width: 1200px) {
    ${tableDesctopCss}
  }

  @media (min-width: 1400px) {
    ${tableDesctopCss}
  }
`;

const trMobileCss = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const trDesctopCss = css``;

export const trCss = css`
  ${trMobileCss}

  @media (min-width: 576px) {
    ${trMobileCss}
  }

  @media (min-width: 768px) {
    display: table-row;
  }

  @media (min-width: 992px) {
    display: table-row;
  }

  @media (min-width: 1200px) {
    display: table-row;
  }

  @media (min-width: 1400px) {
    display: table-row;
  }
`;

export const theadCss = css`
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

export const thRowMobileCss = css`
  padding: 0px;
  text-align: left;
  padding: 0px;
  font-weight: 600;
`;
export const thRowDesctopCss = css`
  padding: 10px 20px;
  // width: 30%;
  // min-width: 300px;
  font-weight: normal;
  display: flex;
  align-items: stretch;
`;

export const thRowCss = css`
  ${thRowMobileCss}
  @media (min-width: 576px) {
    ${thRowMobileCss}
  }

  @media (min-width: 768px) {
    ${thRowDesctopCss}
  }

  @media (min-width: 992px) {
    ${thRowDesctopCss}
  }

  @media (min-width: 1200px) {
    ${thRowDesctopCss}
  }

  @media (min-width: 1400px) {
    ${thRowDesctopCss}
  }
`;

export const thColumnCss = css`
  // font-size: 1.2rem;
  font-weight: normal;
  padding: 10px;
  max-width: 100px;
  text-align: start;
  overflow-wrap: anywhere;
`;

export const headerColumnCss = css`
  // font-size: 1.2rem;
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
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  & > .MuiButtonBase-root {
    display: inline-block;
  }
  &::after {
    content: "";
  }
`;

export const tdCss = (isSelected: boolean, content: string) => css`
  font-weight: normal;

  ${tdMobileCss(isSelected, content)}
  @media (min-width: 576px) {
    ${tdMobileCss(isSelected, content)}
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

export const textFieldCellCss = css`
  display: flex;
  align-items: stretch;
  // align-items: center;

  padding: 5px;

  @media (min-width: 576px) {
    display: flex;
    align-items: center;
  }

  @media (min-width: 768px) {
    display: table-cell;
  }
`;

export const gridTextFieldCellCss = css`
  display: flex;
  align-items: stretch;
  width: 100%;
  // padding: 5px 0;
`;

export const titleTextFieldCellCss = css`
  display: block;
  width: 30%;
  margin-right: 5px;
  @media (min-width: 576px) {
    display: block;
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
