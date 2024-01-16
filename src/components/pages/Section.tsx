import React from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import Question from "../questions";
import TextBlock from "../textBlock";
import { IPage, IState } from "../../types";
import { questionListCss } from "./sc";
import { visibleChecking } from "../../utils/rule-utils";
import Button from "@material-ui/core/Button";
import { COMPLETE_SURVEY } from "../../services/redux/types";
import { onlyDesctopButtonCss } from "../../sc";
import DelayWrapper from "../common/DelayWrapper";

export type IOwnSectionProps = ISectionProps & ConnectedProps<typeof connector>;

export type ISectionProps = {
  page: IPage;
};

const Section: React.FC<IOwnSectionProps> = ({
  page,
  questionCount,
  showCompleteBtn,
  completeSurvey,
}) => {
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
      {showCompleteBtn && (
        <DelayWrapper>
          <Button
            key="continue"
            variant="contained"
            css={onlyDesctopButtonCss}
            onClick={() => completeSurvey()}
          >
            Завершить
          </Button>
        </DelayWrapper>
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const {
    location,
    userAnswers,
    visiblityRulesDict,
    data,
    pageTransitionRuleDict,
    pageMovementLogs,
    pagesDict,
  } = state;

  const { pageIndex } = location;
  const pages = data!.pages || [];

  const currentPage = pages[pageIndex];
  const hasTransitionRule = pageTransitionRuleDict.hasOwnProperty(
    String(currentPage.docID)
  );

  const isLastPage = pageIndex === pages.length - 1;

  const showCompleteBtn = isLastPage && !hasTransitionRule;

  const prevPages = pageMovementLogs
    .map((pageID, index) => {
      if (index + 1 !== pageMovementLogs.length) return pagesDict[pageID].page;
    })
    .filter((page) => !!page) as IPage[];

  const questionCount: number = prevPages.reduce((acc, page) => {
    const currentQuestionsCount = page.questions.reduce((pageAcc, question) => {
      const visibilityRule = visiblityRulesDict[String(question.docID)];
      const isVisible =
        question.config.dataType !== "textblock" &&
        visibleChecking(userAnswers, visibilityRule);
      return pageAcc + (isVisible ? 1 : 0);
    }, 0);

    return acc + currentQuestionsCount;
  }, 0);

  return {
    questionCount,
    showCompleteBtn,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    completeSurvey: () => dispatch({ type: COMPLETE_SURVEY }),
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Section);
