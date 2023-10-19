import React from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import Question from "../questions";
import TextBlock from "../textBlock";
import { IPage, IState } from "../../types";
import { questionListCss } from "./sc";
import { visibleChecking } from "../../utils/rule-utils";

export type IOwnSectionProps = ISectionProps & ConnectedProps<typeof connector>;

export type ISectionProps = {
  page: IPage;
};

const Section: React.FC<IOwnSectionProps> = ({ page, questionCount }) => {
  const questions = page.questions ? page.questions : [];
  let counter = 0;

  return (
    <div css={questionListCss(questionCount)}>
      {questions.map((q, index) => {
        if (q.config.dataType === "textblock") {
          return <TextBlock key={index} question={q} />;
        }
        counter++;
        return (
          <Question
            key={q.docID}
            index={index}
            currentQuestionIndex={questionCount + counter}
            question={q}
            pageID={page.docID}
          />
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const { location, userAnswers, visiblityRulesDict, data } = state;
  const { pageIndex } = location;

  const pages = data?.pages || [];
  const questionCount: number = pages
    .slice(0, pageIndex)
    .reduce((acc, page) => {
      const currentQuestionsCount = page.questions.reduce(
        (pageAcc, question) => {
          const visibilityRule = visiblityRulesDict[String(question.docID)];
          const isVisible =
            question.config.dataType !== "textblock" &&
            visibleChecking(userAnswers, visibilityRule);
          return pageAcc + (isVisible ? 1 : 0);
        },
        0
      );

      return acc + currentQuestionsCount;
    }, 0);

  return {
    questionCount,
  };
};

const mapDispathToProps = (_dispatch: Dispatch) => {
  return {};
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Section);
