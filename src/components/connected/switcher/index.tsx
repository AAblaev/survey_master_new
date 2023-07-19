import React from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { Button, IconButton } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {
  ILocation,
  IParsedData,
  ISlideMoveDirection,
  IState,
} from "../../../types";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  SET_VISITED_PAGE_DOCID,
  START_SURVEY,
  TOGGLE_MODAL_VISIBLE,
} from "../../../services/redux/types";
import { changeCurretLocation } from "../../../services/redux/actions";
import getPrevAndNextLocation from "../../../utils/getPrevAndNextLocation";

import {
  findFirstIncompleteQuestion,
  sectionValidtion,
} from "../../../utils/questionIsDone";
import { buttonCss, iconBtnCss } from "./sc";

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
}) => {
  if (isEmptyData) {
    return null;
  }

  const [prevLocation, nextLocation] = getPrevAndNextLocation(location);
  const showBackBtn = !(!isShowPageList && prevLocation.pathName === "survey");
  const resultValidation = findFirstIncompleteQuestion(pages, userAnswers);
  const resultSectionValidation =
    location.pathName === "section" &&
    sectionValidtion(pages[location.pageIndex], userAnswers);

  // console.log("resultSectionValidation", resultSectionValidation);

  const rightClick = resultSectionValidation
    ? () => {
        noticePage(String(pages[location.pageIndex].docID));
        handleClick({
          location: nextLocation,
          slideMoveDirection: "right-to-left",
          needSendAnswers: true,
        });
      }
    : () => {
        noticePage(String(pages[location.pageIndex].docID));
      };

  const completeSurvey = () => {
    if (!resultValidation) {
      submit();
      return;
    }
    openModal();
  };

  switch (location.pathName) {
    case "greeting": {
      return (
        <>
          <Button
            key="1"
            css={buttonCss(true, "right")}
            onClick={() => {
              handleClick({
                location: {
                  pageIndex: 0,
                  questionIndex: 0,
                  pathName: isShowPageList ? "survey" : "section",
                  title: isShowPageList ? "survey" : "section",
                },
                slideMoveDirection: "right-to-left",
                needSendAnswers: false,
              });
              startSurvey();
            }}
          >
            {buttonStartCaption}
          </Button>
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
          <IconButton
            key="IconButton2"
            css={iconBtnCss("left")}
            disabled
            onClick={() =>
              handleClick({
                location: prevLocation,
                slideMoveDirection: "left-to-right",
                needSendAnswers: true,
              })
            }
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </>
      );
    }
    case "section": {
      return (
        <>
          <Button
            key="1"
            css={buttonCss(true, "right")}
            onClick={() => {
              nextLocation.pageIndex === pagesCount
                ? completeSurvey()
                : rightClick();
            }}
          >
            {nextLocation.pageIndex === pagesCount
              ? buttonFinishCaption
              : buttonNextCaption}
          </Button>

          <Button
            key="2"
            css={buttonCss(showBackBtn, "left")}
            onClick={() =>
              handleClick({
                location: prevLocation,
                slideMoveDirection: "left-to-right",
                needSendAnswers: true,
              })
            }
          >
            {buttonBackCaption}
          </Button>

          <IconButton
            key="IconButton1"
            css={iconBtnCss("right")}
            disabled={nextLocation.pageIndex === pagesCount}
            onClick={() => {
              rightClick();
            }}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
          <IconButton
            key="IconButton2"
            css={iconBtnCss("left")}
            disabled={!isShowPageList && prevLocation.pathName === "survey"}
            onClick={() =>
              handleClick({
                location: prevLocation,
                slideMoveDirection: "left-to-right",
                needSendAnswers: true,
              })
            }
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
  } = state;

  const isEmptyData = !Boolean(data);
  const buttonStartCaption = data?.buttonStartCaption || "";
  const buttonNextCaption = data?.buttonNextCaption || "";
  const buttonBackCaption = data?.buttonBackCaption || "";
  const buttonFinishCaption = data?.buttonFinishCaption || "";
  const isShowPageList = data?.isShowPageList || false;
  const pages = data?.pages || [];
  const pagesCount = pages.length;

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

export default connector(Switcher);
