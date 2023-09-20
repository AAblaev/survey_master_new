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
  isShowPageList,
  startSurvey,
  isEmptyData,
  completeSurvey,
  userAnswers,
  pages,
  uid,
  continueSurvey,
  setNextPage,
  setPrevPage,
  selectPage,
  showFinishBtn,
  strictModeNavigation,
  pageList,
  setFirstPage,
}) => {
  if (isEmptyData) {
    return null;
  }

  const { pageIndex } = location;
  const showBackBtn = !(!isShowPageList && pageIndex === 0);
  const firstIncompleteQuestion = findFirstIncompleteQuestion(
    pages,
    userAnswers
  );

  const firstPageDocID = String(pages[0].docID);

  // saga action
  // const completeSurvey = () => {
  //   noticePage(String(pages[pageIndex].docID));
  //   if (!firstIncompleteQuestion) {
  //     submit();
  //     return;
  //   }
  //   openModal();
  // };

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
            onClick={() => setFirstPage(firstPageDocID)}
          >
            {buttonNextCaption}
          </Button>

          <IconButton
            key="IconButton1"
            css={iconBtnCss("right")}
            onClick={() => setFirstPage(firstPageDocID)}
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
            pageList={pageList}
            showList={isShowPageList}
            selectPage={selectPage}
          />

          <Button
            key="1"
            css={buttonCss(true, "right")}
            onClick={() => {
              showFinishBtn ? completeSurvey() : setNextPage();
            }}
          >
            {showFinishBtn ? buttonFinishCaption : buttonNextCaption}
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
            disabled={showFinishBtn}
            onClick={() => {
              setNextPage();
            }}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>

          <IconButton
            key="IconButton2"
            css={iconBtnCss("left")}
            disabled={strictModeNavigation && location.pageIndex === 0}
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
    pageTransitionRuleDict,
    strictModeNavigation,
    pagesDict,
  } = state;
  // console.log("pageMovementLogs", pageMovementLogs);
  // console.log("visitedPageDocIDList", visitedPageDocIDList);

  const isEmptyData = !Boolean(data);
  const buttonStartCaption = data?.buttonStartCaption || "";
  const buttonNextCaption = data?.buttonNextCaption || "";
  const buttonBackCaption = data?.buttonBackCaption || "";
  const buttonFinishCaption = data?.buttonFinishCaption || "";
  const isShowPageList = data?.isShowPageList || false;
  const pages = data?.pages || [];
  const pagesCount = pages.length;
  const uid = isEmptyData ? "" : params?.uid;
  const currentPage = pages[location.pageIndex];
  const pageTransitionRules = pageTransitionRuleDict[String(currentPage.docID)];
  const showFinishBtn =
    location.pageIndex + 1 === pagesCount && !pageTransitionRules;
  const pageList = strictModeNavigation
    ? pageMovementLogs.map((pageDocID) => pagesDict[pageDocID].page)
    : pages;
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
    showFinishBtn,
    strictModeNavigation,
    pageList,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    startSurvey: () => dispatch({ type: START_SURVEY, isContinue: false }),
    continueSurvey: () => dispatch({ type: START_SURVEY, isContinue: true }),
    setNextPage: (docID?: string) =>
      dispatch({
        type: SAGA_CHANGE_CURRENT_PAGE,
        direction: "right-to-left",
        targetPageID: docID,
      }),
    setPrevPage: (docID?: string) =>
      dispatch({
        type: SAGA_CHANGE_CURRENT_PAGE,
        direction: "left-to-right",
        targetPageID: docID,
      }),

    setFirstPage: (targetPageID: string) => {
      dispatch(goToTheNextPage({ direction: "right-to-left", targetPageID }));
    },

    // setSurveyPage:()=>dispatch(changeCurretLocation({
    //   location: {
    //     pageIndex: 0,
    //     questionIndex: 0,
    //     pathName: "survey",
    //     title: "survey",
    //   },
    //   slideMoveDirection: "left-to-right",
    // })),

    selectPage: (pageDocID: string) => {},

    completeSurvey: () => {
      dispatch({ type: COMPLETE_SURVEY });
      // dispatch(
      //   changeCurretLocation({
      //     location: {
      //       pageIndex: 0,
      //       questionIndex: 0,
      //       pathName: "completion",
      //       title: "completion",
      //     },
      //     slideMoveDirection: "right-to-left",
      //   })
      // );
    },

    // handleClick: (payload: {
    //   location: ILocation;
    //   slideMoveDirection: ISlideMoveDirection;
    //   needSendAnswers: boolean;
    // }) => {
    //   const { location, slideMoveDirection, needSendAnswers } = payload;
    //   // dispatch({ type: CHANGE_CURRENT_PAGE, direction: slideMoveDirection });
    //   dispatch(
    //     changeCurretLocation({
    //       location: location,
    //       slideMoveDirection: slideMoveDirection,
    //     })
    //   );
    //   needSendAnswers && dispatch({ type: SEND_SURVEY_DATA });
    // },
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Switcher);
