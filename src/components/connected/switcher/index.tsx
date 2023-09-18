import React from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { Button, IconButton } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { ILocation, ISlideMoveDirection, IState } from "../../../types";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SAGA_CHANGE_CURRENT_PAGE,
  SEND_SURVEY_DATA,
  SET_VISITED_PAGE_DOCID,
  START_SURVEY,
  TOGGLE_MODAL_VISIBLE,
} from "../../../services/redux/types";
import {
  changeCurretLocation,
  goToTheNextPage,
  goToThePrevPage,
} from "../../../services/redux/actions";
import getPrevAndNextLocation from "../../../utils/getPrevAndNextLocation";

import { findFirstIncompleteQuestion } from "../../../utils/questionIsDone";
import { buttonCss, iconBtnCss } from "./sc";
import Nav from "../../common/Nav";

export type ISwitcherProps = ConnectedProps<typeof connector>;

const Switcher: React.FC<ISwitcherProps> = ({
  location,
  buttonStartCaption,
  buttonNextCaption,
  buttonBackCaption,
  buttonFinishCaption,
  pagesCount,
  isShowPageList,
  handleClick,
  startSurvey,
  isEmptyData,
  submit,
  openModal,
  noticePage,
  userAnswers,
  pages,
  uid,
  continueSurvey,
  setNextPage,
  setPrevPage,
}) => {
  if (isEmptyData) {
    return null;
  }

  const [prevLocation, nextLocation] = getPrevAndNextLocation(location);
  const { pageIndex } = location;
  const showBackBtn = !(!isShowPageList && prevLocation.pathName === "survey");
  const firstIncompleteQuestion = findFirstIncompleteQuestion(
    pages,
    userAnswers
  );

  const completeSurvey = () => {
    noticePage(String(pages[pageIndex].docID));
    if (!firstIncompleteQuestion) {
      submit();
      return;
    }
    openModal();
  };

  const pageTitle = pages[pageIndex].title
    ? pages[pageIndex].title
    : `Страница ${pageIndex + 1}`;

  switch (location.pathName) {
    case "greeting": {
      return (
        <>
          <Button key="1" css={buttonCss(true, "right")} onClick={startSurvey}>
            {uid ? "начать заново" : buttonStartCaption}
          </Button>

          {uid && (
            <Button
              key="2"
              css={buttonCss(true, "left")}
              onClick={continueSurvey}
            >
              Продолжить
            </Button>
          )}
        </>
      );
    }
    case "survey": {
      return (
        <>
          <Button
            key="1"
            css={buttonCss(true, "right")}
            onClick={() =>
              handleClick({
                location: {
                  pageIndex: 0,
                  questionIndex: 0,
                  pathName: "section",
                  title: "section",
                },
                slideMoveDirection: "right-to-left",
                needSendAnswers: false,
              })
            }
          >
            {buttonNextCaption}
          </Button>

          <IconButton
            key="IconButton1"
            css={iconBtnCss("right")}
            onClick={() =>
              handleClick({
                location: {
                  pageIndex: 0,
                  questionIndex: 0,
                  pathName: "section",
                  title: "section",
                },
                slideMoveDirection: "right-to-left",
                needSendAnswers: false,
              })
            }
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
          <IconButton key="IconButton2" css={iconBtnCss("left")} disabled>
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </>
      );
    }
    case "section": {
      return (
        <>
          <Nav
            title={pageTitle}
            pages={pages}
            currentPageIndex={pageIndex}
            isShowPageList={isShowPageList}
            onChange={(pageIndex, slideMoveDirection) => {
              handleClick({
                location: {
                  pageIndex: pageIndex,
                  pathName: "section",
                  questionIndex: 0,
                  title: "section",
                },
                needSendAnswers: true,
                slideMoveDirection: slideMoveDirection,
              });
            }}
          />

          <Button
            key="1"
            css={buttonCss(true, "right")}
            onClick={() => {
              nextLocation.pageIndex === pagesCount
                ? completeSurvey()
                : setNextPage();
            }}
          >
            {nextLocation.pageIndex === pagesCount
              ? buttonFinishCaption
              : buttonNextCaption}
          </Button>

          <Button
            key="2"
            css={buttonCss(showBackBtn, "left")}
            onClick={() => setPrevPage()}
          >
            {buttonBackCaption}
          </Button>

          <IconButton
            key="IconButton1"
            css={iconBtnCss("right")}
            disabled={nextLocation.pageIndex === pagesCount}
            onClick={() => {
              setNextPage();
            }}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
          <IconButton
            key="IconButton2"
            css={iconBtnCss("left")}
            disabled={!isShowPageList && prevLocation.pathName === "survey"}
            onClick={() => setPrevPage()}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </>
      );
    }
  }
  return <></>;
};

const mapStateToProps = (state: IState) => {
  const {
    location,
    slideMoveDirection,
    userAnswers,
    modalVisible,
    data,
    params,
    pageMovementLogs,
    visitedPageDocIDList,
  } = state;
  console.log("pageMovementLogs", pageMovementLogs);
  console.log("visitedPageDocIDList", visitedPageDocIDList);

  const isEmptyData = !Boolean(data);
  const buttonStartCaption = data?.buttonStartCaption || "";
  const buttonNextCaption = data?.buttonNextCaption || "";
  const buttonBackCaption = data?.buttonBackCaption || "";
  const buttonFinishCaption = data?.buttonFinishCaption || "";
  const isShowPageList = data?.isShowPageList || false;
  const pages = data?.pages || [];
  const pagesCount = pages.length;
  const uid = isEmptyData ? "" : params?.uid;

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
    uid,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    startSurvey: () => dispatch({ type: START_SURVEY, isContinue: false }),
    continueSurvey: () => dispatch({ type: START_SURVEY, isContinue: true }),
    openModal: () => dispatch({ type: TOGGLE_MODAL_VISIBLE, payload: true }),
    setNextPage: () =>
      dispatch({ type: SAGA_CHANGE_CURRENT_PAGE, direction: "right-to-left" }),
    setPrevPage: () =>
      dispatch({ type: SAGA_CHANGE_CURRENT_PAGE, direction: "left-to-right" }),

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
      // dispatch({ type: CHANGE_CURRENT_PAGE, direction: slideMoveDirection });
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

export default connector(Switcher);
