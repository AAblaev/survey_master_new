import React, { useRef, useEffect, useLayoutEffect } from "react";
import { Button, Typography } from "@material-ui/core";
import Question from "../questions";
import { ILocation, IPage, ISlideMoveDirection, IState } from "../../types";
import TextBlock from "../textBlock";
import { Dispatch } from "redux";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  SET_VISITED_PAGE_DOCID,
  TOGGLE_MODAL_VISIBLE,
} from "../../services/redux/types";
import { changeCurretLocation } from "../../services/redux/actions";
import { connect, ConnectedProps } from "react-redux";
import { onlyDesctopButtonCss } from "../../sc";
import { findFirstIncompleteQuestion } from "../../utils/questionIsDone";
import { questionListCss, titleCss } from "./sc";

export type IOwnSectionProps = ISectionProps & ConnectedProps<typeof connector>;

export type ISectionProps = {
  page: IPage;
  // pageIndex: number;
  questionCount: number;
};

const Section: React.FC<IOwnSectionProps> = ({
  page,
  questionCount,
  showFinishBtn,
  buttonFinishCaption,
  noticePage,
  submit,
  openModal,
  resultValidation,
}) => {
  console.log("Section", questionCount);
  const questions = page.questions ? page.questions : [];
  let counter = 0;

  const completeSurvey = () => {
    noticePage(String(page.docID));
    if (!resultValidation) {
      submit();
      return;
    }
    openModal();
  };

  return (
    <div>
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
              questionCount={questionCount}
              question={q}
              pageID={page.docID}
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

const mapStateToProps = (state: IState) => {
  const {
    location,
    slideMoveDirection,
    userAnswers,
    modalVisible,
    data,
  } = state;
  const { pathName, pageIndex, questionIndex } = location;

  const isEmptyData = !Boolean(data);
  const buttonStartCaption = data?.buttonStartCaption || "";
  const buttonNextCaption = data?.buttonNextCaption || "";
  const buttonBackCaption = data?.buttonBackCaption || "";
  const buttonFinishCaption = data?.buttonFinishCaption || "";
  const isShowPageList = data?.isShowPageList || false;
  const pages = data?.pages || [];
  const pagesCount = pages.length;
  const showFinishBtn =
    pathName === "section" && pageIndex + 1 === pages.length;
  const resultValidation = findFirstIncompleteQuestion(pages, userAnswers);
  return {
    isEmptyData,
    resultValidation,
    location,
    slideMoveDirection,
    modalVisible,
    buttonStartCaption,
    buttonNextCaption,
    buttonBackCaption,
    buttonFinishCaption,
    isShowPageList,
    pagesCount,
    showFinishBtn,
    questionIndex,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    fetchData: () => dispatch({ type: FETCH_SURVEY_DATA }),
    openModal: () => dispatch({ type: TOGGLE_MODAL_VISIBLE, payload: true }),
    closeModal: () => dispatch({ type: TOGGLE_MODAL_VISIBLE, payload: false }),
    submit: () => {
      dispatch({ type: COMPLETE_SURVEY });
      dispatch(
        changeCurretLocation({
          location: {
            pageIndex: 0,
            questionIndex: 0,
            pathName: "completion",
            title: "completion",
          },
          slideMoveDirection: "right-to-left",
        })
      );
    },
    handleClick: (payload: {
      location: ILocation;
      slideMoveDirection: ISlideMoveDirection;
      needSendAnswers: boolean;
    }) => {
      const { location, slideMoveDirection, needSendAnswers } = payload;
      dispatch(
        changeCurretLocation({
          location: location,
          slideMoveDirection: slideMoveDirection,
        })
      );
      needSendAnswers && dispatch({ type: SEND_SURVEY_DATA });
    },
    noticePage: (docID: string) => {
      dispatch({ type: SET_VISITED_PAGE_DOCID, payload: docID });
    },
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Section);
