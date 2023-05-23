import React from "react";
import { Typography } from "@material-ui/core";
import { css } from "@emotion/react";
import Question from "../questions";
import { IPage } from "../../types";
import { DEFAULT_BACKGROUND_COLOR, PRIMARY_COLOR } from "../../consts/const";

export type IPageProps = {
  page: IPage;
  pageIndex: number;
};

export const pageCss = css`
  display: flex;
  flex-direction: column;
  padding-right: 40px;
  padding-left: 40px;

  // Устройства Small (телефоны с горизонтальной ориентацией, 576 пикселей и выше)
  @media (min-width: 576px) {
    padding-right: 5%;
    padding-left: 5%;
  }

  // Устройства Medium (планшеты, 768 пикселей и выше)
  @media (min-width: 768px) {
    padding-right: 5%;
    padding-left: 5%;
  }

  // Устройства Large (настольные компьютеры, 992 пикселей и выше)
  @media (min-width: 992px) {
    padding-right: 15%;
    padding-left: 15%;
  }

  // Устройства X-Large (большие настольные компьютеры, 1200 пикселей и выше)
  @media (min-width: 1200px) {
    padding-right: 20%;
    padding-left: 20%;
  }

  // Устройства XX-Large (большие настольные компьютеры, 1400 пикселей и выше)
  @media (min-width: 1400px) {
    padding-right: 20%;
    padding-left: 20%;
  }
`;

export const questionListCss = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const titleCss = css`
  &.MuiTypography-body1 {
    font-size: 1.2rem;
    color: ${PRIMARY_COLOR};
    font-weight: bold;
  }
`;

const Page: React.FC<IPageProps> = ({ page, pageIndex }) => {
  const questions = page.questions ? page.questions : [];
  const title = page.title ? page.title : `Страница ${pageIndex + 1}`;

  return (
    <div css={pageCss}>
      <Typography css={titleCss}>{title}</Typography>
      <div css={questionListCss}>
        {questions.map((q, index) => (
          <Question key={index} currentQuestionIndex={index} question={q} />
        ))}
      </div>
    </div>
  );
};

export default Page;
