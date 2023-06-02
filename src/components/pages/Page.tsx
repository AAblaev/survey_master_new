import React from "react";
import { Typography } from "@material-ui/core";
import { css } from "@emotion/react";
import Question from "../questions";
import { IPage } from "../../types";
import { DEFAULT_BACKGROUND_COLOR, PRIMARY_COLOR } from "../../consts/const";

export type IPageProps = {
  page: IPage;
  pageIndex: number;
  questionCount: number;
};

export const questionListCss = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const titleCss = css`
  &.MuiTypography-body1 {
    font-size: 1.2rem;
    color: ${PRIMARY_COLOR};
    font-weight: bold;
  }
`;

const Page: React.FC<IPageProps> = ({ page, pageIndex, questionCount }) => {
  const questions = page.questions ? page.questions : [];
  const title = page.title ? page.title : `Страница ${pageIndex + 1}`;

  return (
    <div className="adaptive-paddings">
      {false && <Typography css={titleCss}>{title}</Typography>}
      <div css={questionListCss}>
        {questions.map((q, index) => (
          <Question
            key={index}
            currentQuestionIndex={questionCount + index}
            question={q}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
