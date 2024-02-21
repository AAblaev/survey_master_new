import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IQuestion, IStyles } from "../../../types";
import TextBlock from "../../textBlock";
import Question from "../../questions";
import { css } from "@emotion/react";
import { titleCountCss, titleCss, titleTextCss } from "../sc";
import { DEFAULT_STYLES } from "../../../consts/const";

export const groupCss = (
  backgroundColor: string,
  borderColor: string,
  borderSize: number,
  borderRadius: number
) => css`
  background-color: ${backgroundColor};
  border: ${borderSize}px solid ${borderColor};
  &.MuiPaper-root {
    border-radius: ${borderRadius}px;
  }
  &::before {
    display: none;
  }
`;

export const accDetailsCss = (padding: string) => css`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;
  counter-reset: subSection ${0};

  padding: ${padding};
`;

export const summaryCss = (
  backgroundColor: string,
  padding: string,
  borderRadius: number
) => css`
  position: sticky;
  background-color: ${backgroundColor};
  border-radius: ${borderRadius}px;

  top: 0;
  z-index: 10;
  padding: ${padding};
`;

export type IQuestionsGroup = {
  docID: number;
  title: string;
  questions: IQuestion[];
  pageID: number;
};

export type IQuestionsGroupProps = IQuestionsGroup & {
  questionGroupStyles?: IStyles["componentsStyle"]["questionGroup"];
  expand: boolean;
};

const QuestioinsGroup: React.FC<IQuestionsGroupProps> = ({
  docID,
  title,
  questions,
  pageID,
  questionGroupStyles = DEFAULT_STYLES["componentsStyle"]["questionGroup"],
  expand,
}) => {
  return (
    <Accordion
      disableGutters
      defaultExpanded={expand}
      elevation={questionGroupStyles.elevation}
      css={groupCss(
        questionGroupStyles.background.color,
        questionGroupStyles.border.color,
        questionGroupStyles.border.size,
        questionGroupStyles.border.radius
      )}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={String(docID)}
        id={String(pageID)}
        css={summaryCss(
          questionGroupStyles.background.color,
          questionGroupStyles.title.padding,
          questionGroupStyles.border.radius
        )}
      >
        <div css={titleCss(false)}>
          <div
            css={titleCountCss(
              questionGroupStyles.counter.font.color,
              questionGroupStyles.counter.font.size,
              false
            )}
          ></div>
          <div
            css={titleTextCss(
              false,
              questionGroupStyles.title.font.color,
              questionGroupStyles.title.font.size
            )}
          >
            {title}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails
        css={accDetailsCss(questionGroupStyles.details.padding)}
      >
        {questions.map((q, index) => {
          if (q.config.dataType === "textblock") {
            return <TextBlock key={index} question={q} />;
          }
          return (
            <Question
              key={String(index) + String(q.docID)}
              index={index}
              currentQuestionIndex={index}
              question={q}
              pageID={pageID}
              isGrouped={true}
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default QuestioinsGroup;
