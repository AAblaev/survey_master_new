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
  START_SURVEY,
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
  pages,
  questionCount,
  showFinishBtn,
  buttonFinishCaption,
  noticePage,
  submit,
  openModal,
  userAnswers,
  pageIndex,
}) => {
  const questions = page.questions ? page.questions : [];
  const title = page.title ? page.title : `Страница ${pageIndex + 1}`;
  let counter = 0;

  const resultValidation = findFirstIncompleteQuestion(pages, userAnswers);

  const completeSurvey = () => {
    noticePage(String(page.docID));
    if (!resultValidation) {
      submit();
      return;
    }
    openModal();
  };
  // <Typography css={titleCss}>{title}</Typography>

  return (
    <div>
      <div css={questionListCss}>
        {questions.map((q, index) => {
          if (q.config.dataType === "textblock") {
            return <TextBlock key={index} question={q} />;
          }
          counter++;
          return (
            <Question
              key={index}
              index={index}
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

  return {
    isEmptyData,
    userAnswers,
    location,
    slideMoveDirection,
    modalVisible,
    buttonStartCaption,
    buttonNextCaption,
    buttonBackCaption,
    buttonFinishCaption,
    isShowPageList,
    pages,
    pagesCount,
    showFinishBtn,
    questionIndex,
    pageIndex,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    fetchData: () => dispatch({ type: FETCH_SURVEY_DATA }),
    startSurvey: () => dispatch({ type: START_SURVEY }),
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
