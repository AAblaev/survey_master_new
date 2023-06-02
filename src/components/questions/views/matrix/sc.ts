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
  @media (min-width: 576px) {
    ${tbodyMobileCss}
  }

  @media (min-width: 768px) {
    ${tbodyMobileCss}
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
  border-spacing: 0px;
  border-collapse: collapse;
  @media (min-width: 576px) {
    ${tableMobileCss}
  }

  @media (min-width: 768px) {
    ${tableMobileCss}
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

export const trCss = css`
  display: table-row;

  @media (min-width: 576px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
  @media (min-width: 576px) {
    display: none;
  }

  @media (min-width: 768px) {
    display: none;
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
  font-weight: 600;
`;
export const thRowDesctopCss = css`
  padding: 10px 20px;
  width: 30%;
  font-weight: normal;
`;

export const thRowCss = css`
  text-align: left;
  font-weight: normal;
  // font-size: 1.2rem;

  @media (min-width: 576px) {
    ${thRowMobileCss}
  }

  @media (min-width: 768px) {
    ${thRowMobileCss}
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
  overflow-wrap: anywhere;
`;

export const tdMobileCss = (isSelected: boolean, content: string) => css`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding:1rem;
  border: 1px solid #e5e5e5;

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
  display: table-cell;
  & > .MuiButtonBase-root {
    display: inline-block;
  }
  &::after {
    content: "";
  }
`;

export const tdCss = (isSelected: boolean, content: string) => css`
  font-weight: normal;
  text-align: center;

  @media (min-width: 576px) {
    ${tdMobileCss(isSelected, content)}
  }

  @media (min-width: 768px) {
    ${tdMobileCss(isSelected, content)}
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
