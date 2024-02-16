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

export type IQuestionsGroup = {
  docID: number;
  title: string;
  questions: IQuestion[];
  pageID: number;
};

export type IQuestionsGroupProps = IQuestionsGroup;

const QuestioinsGroup: React.FC<IQuestionsGroupProps> = ({
  docID,
  title,
  questions,
  pageID,
}) => {
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={String(docID)}
        id={String(pageID)}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
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
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

export default QuestioinsGroup;
