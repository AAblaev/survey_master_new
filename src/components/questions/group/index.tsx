import React, { useEffect, useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  IAnswer,
  IDataType,
  IQuestion,
  ISimpleType,
  IState,
  IStyles,
} from "../../../types";
import Typography from "@mui/material/Typography";
import TextBlock from "../../textBlock";
import Question from "../../questions";
import { css } from "@emotion/react";
import { titleCountCss, titleCss, titleTextCss } from "../sc";
import { DEFAULT_STYLES } from "../../../consts/const";

export const groupCss = (backgroundColor: string, isFlat: boolean) => css`

  ${isFlat && `box-shadow: none;`}
  background-color: ${backgroundColor};

  &::before {
    display: none;
  }
`;
export const accDetailsCss = (isFlat: boolean) => css`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;
  counter-reset: subSection ${0};
  ${!isFlat && `padding-left: 30px;`}
`;

export const summaryCss = (backgroundColor: string, isFlat: boolean) => css`
  position: sticky;
  background-color: ${backgroundColor};
  top: 0;
  z-index: 10;
  ${isFlat && `padding: 0;`}
`;

export type IQuestionsGroup = {
  docID: number;
  title: string;
  questions: IQuestion[];
  pageID: number;
};

export type IQuestionsGroupProps = IQuestionsGroup & {
  questionGroupStyles?: IStyles["componentsStyle"]["questionGroup"];
  isFlat?: boolean;
  backgroundColor: string;
  expand: boolean;
};

const QuestioinsGroup: React.FC<IQuestionsGroupProps> = ({
  docID,
  title,
  questions,
  pageID,
  questionGroupStyles = DEFAULT_STYLES["componentsStyle"]["questionGroup"],
  isFlat = false,
  backgroundColor,
  expand,
}) => {
  return (
    <Accordion
      elevation={isFlat ? 0 : 4}
      disableGutters
      defaultExpanded={expand}
      css={groupCss(backgroundColor, isFlat)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={String(docID)}
        id={String(pageID)}
        css={summaryCss(backgroundColor, isFlat)}
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
      <AccordionDetails css={accDetailsCss(isFlat)}>
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
