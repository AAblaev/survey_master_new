import React from "react";
import { Button, Typography } from "@material-ui/core";
import { css } from "@emotion/react";
import Question from "../questions";
import { IPage } from "../../types";
import { PRIMARY_COLOR } from "../../consts/const";
import TextBlock from "../textBlock";
import { onlyDesctopButtonCss } from "../../sc";

export type ISectionProps = {
  page: IPage;
  pageIndex: number;
  questionCount: number;
  showFinishBtn: boolean;
  buttonFinishCaption: string;
  completeSurvey: () => void;
};

export const questionListCss = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
`;

export const titleCss = css`
  &.MuiTypography-body1 {
    font-size: 1.2rem;
    color: ${PRIMARY_COLOR};
    font-weight: bold;
  }
`;

const Section: React.FC<ISectionProps> = ({
  page,
  pageIndex,
  questionCount,
  showFinishBtn,
  buttonFinishCaption,
  completeSurvey,
}) => {
  const questions = page.questions ? page.questions : [];
  const title = page.title ? page.title : `Страница ${pageIndex + 1}`;
  let counter = 0;

  return (
    <div>
      {false && <Typography css={titleCss}>{title}</Typography>}
      <div css={questionListCss}>
        {questions.map((q, index) => {
          if (q.config.dataType === "textblock") {
            return <TextBlock key={index} question={q} />;
          }
          counter++;
          return (
            <Question
              key={index}
              currentQuestionIndex={questionCount + counter}
              question={q}
            />
          );
        })}
      </div>
      {showFinishBtn && (
        <Button
          key="finish"
          css={onlyDesctopButtonCss}
          variant="contained"
          onClick={() => {
            completeSurvey();
          }}
        >
          {buttonFinishCaption}
        </Button>
      )}
    </div>
  );
};

export default Section;
