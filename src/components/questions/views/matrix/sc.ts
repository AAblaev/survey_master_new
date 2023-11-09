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

export const tableCss = css`
  & .MuiTable-root {
    width: auto;
    max-width: 99%;
    min-width: 700px;
  }
  position: relative;
  z-index: 2;
  overflow: hidden;
`;

export const tableHeaderColumnCss = css`
  min-width: 250px;

  &.MuiTableCell-root {
    border: none;
    padding: 0px;
  }
`;

export const tableHeaderCellCss = css`
  &.MuiTableCell-root {
    border: none;
    // text-align: center;
  }
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
