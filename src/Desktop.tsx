import React, { useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Button from "@material-ui/core/Button";

import { css } from "@emotion/react";
import "./assets/index.css";
import {
  ILocation,
  IPage,
  IPathName,
  ISlideMoveDirection,
  IState,
} from "./types";
import { Dispatch } from "redux";
import AppBar from "./components/common/AppBar";
import { DEFAULT_BACKGROUND_COLOR, TIMEOUT_VALUE } from "./consts/const";
import Survey from "./components/pages/Survey";
import Page from "./components/pages/Page";
import { changeCurretLocation } from "./services/redux/actions";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  START_SURVEY,
} from "./services/redux/types";
import ProgressBar from "./components/common/ProgressBar";
import InfoPage from "./components/pages/InfoPage";
import bottomBtnRender from "./components/common/renderBottomBtns";
import ProgressLinear from "./components/common/ProgressLinear";
import PerfectScrollbar from "react-perfect-scrollbar";
import Typography from "@material-ui/core/Typography";
import { isQuestionDone, isRequiredQuestionDone } from "./utils/questionIsDone";

export type IDesktop = ConnectedProps<typeof connector>;

export const desctopCss = css`
  background-color: ${DEFAULT_BACKGROUND_COLOR};
  width: 100%;
  // min-height: 100vh;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  align-items: center;
`;

export const contentCss = css`
  flex: 1 0 auto;
  width: 100%;
  margin: 56px 0;
  height: calc(100% - 112px);
  @media (min-width: 600px) {
    margin: 64px 0;
    height: calc(100% - 128px);
  }
`;

export const buttonCss = css`
  background-color: #3b424a;
  &.MuiButton-root {
    color: #fff;
  }
`;

export const transitionGroupCss = css`
  margin-top: 20px;
  margin-bottom: 20px;
  & > div {
    box-sizing: border-box;
  }
`;

const Desktop: React.FC<IDesktop> = ({
  name,
  pages,
  userAnswers,
  loading,
  error,
  emptyData,
  location,
  slideMoveDirection,
  handleClick,
  completeSurvey,
  page,
  pageIndex,
  // params,
  fetchData,
  startSurvey,
  greetingsPage,
  buttonStartCaption,
  buttonBackCaption,
  buttonFinishCaption,
  buttonNextCaption,
  completionPage,
  // disqualificationPage,
  isShowProgressbar,
  isShowQuestionsCount,
}) => {
  const { title, pathName } = location;

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error.status) {
    return (
      <div css={desctopCss}>
        <AppBar direction="top" fixed></AppBar>
        <div css={contentCss}>
          <div>Error: {error.message}</div>
        </div>
        <AppBar direction="bottom" fixed></AppBar>
      </div>
    );
  }

  const slideRender = (pathName: IPathName) => {
    if (pathName === "greeting") return <InfoPage html={greetingsPage} />;
    if (pathName === "completion") return <InfoPage html={completionPage} />;
    if (pathName === "survey") return <Survey />;
    if (pathName === "section")
      return <Page page={page} pageIndex={pageIndex} />;
    return null;
  };
  const pagesCount = pages.length;
  const allQuestionCount = pages.reduce(
    (acc: number, page: IPage) => (acc += page.questions.length),
    0
  );

  const allQuestionsDoneCount = Object.values(userAnswers).filter(
    isQuestionDone
  ).length;

  const allRequiredQuestionDone = isRequiredQuestionDone(pages, userAnswers);
  // console.log("allRequiredQuestionDone", allRequiredQuestionDone);

  const perfectScrollbarRef = useRef<any>(null);
  const perfectScrollbarContainerRef = useRef<HTMLElement | null>(null);

  return (
    <div css={desctopCss}>
      {loading && (
        <ProgressBar
          position={"absolute"}
          background={"rgba(255, 255, 255, 0.5)"}
        />
      )}
      <AppBar direction="top" fixed>
        {pathName === "section" && (
          <Button
            css={buttonCss}
            onClick={() =>
              handleClick({
                location: {
                  pageIndex: 0,
                  questionIndex: 0,
                  pathName: "survey",
                  title: "survey",
                },
                slideMoveDirection: "left-to-right",
                needSendAnswers: true,
              })
            }
          >
            К списку страниц
          </Button>
        )}
      </AppBar>

      <div css={contentCss}>
        <PerfectScrollbar
          options={{ suppressScrollX: true }}
          ref={perfectScrollbarRef}
          containerRef={(ref) => {
            perfectScrollbarContainerRef.current = ref;
          }}
        >
          {pathName !== "greeting" && (
            <div className="survey-name adaptive-paddings">{name}</div>
          )}
          {pathName !== "greeting" && (
            <div className="adaptive-paddings">
              <ProgressLinear
                allQuestionCount={allQuestionCount}
                allQuestionsDoneCount={allQuestionsDoneCount}
                isShowProgressbar={isShowProgressbar}
                isShowQuestionsCount={isShowProgressbar}
              />
            </div>
          )}
          <TransitionGroup
            css={transitionGroupCss}
            childFactory={(child) =>
              React.cloneElement(child, {
                classNames: slideMoveDirection,
              })
            }
          >
            <CSSTransition
              key={title + location.pageIndex}
              classNames="left-to-right"
              timeout={{ enter: TIMEOUT_VALUE, exit: TIMEOUT_VALUE }}
              onExiting={() => {
                if (perfectScrollbarContainerRef.current)
                  perfectScrollbarContainerRef.current.scrollTop = 0;
              }}
              onExited={() => {
                setTimeout(() => {
                  if (perfectScrollbarRef.current)
                    perfectScrollbarRef.current.updateScroll();
                });
              }}
            >
              {slideRender(pathName)}
            </CSSTransition>
          </TransitionGroup>
        </PerfectScrollbar>
      </div>
      <AppBar direction="bottom" fixed>
        {bottomBtnRender({
          location,
          buttonStartCaption,
          buttonNextCaption,
          buttonBackCaption,
          buttonFinishCaption,
          handleClick,
          startSurvey,
          completeSurvey,
          pagesCount,
        })}
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  // console.log("state", state);

  const {
    loading,
    error,
    location,
    slideMoveDirection,
    data,
    params,
    userAnswers,
  } = state;

  const emptyData = !Boolean(data);
  const pages = data ? data.pages : [];
  const { pageIndex } = location;
  const currentPage = pages[pageIndex];
  const greetingsPage = data ? data.greetingsPage : "";
  const completionPage = data ? data.completionPage : "";
  const disqualificationPage = data ? data.disqualificationPage : "";
  const buttonStartCaption = data ? data.buttonStartCaption : "";
  const buttonBackCaption = data ? data.buttonBackCaption : "";
  const buttonFinishCaption = data ? data.buttonFinishCaption : "";
  const buttonNextCaption = data ? data.buttonNextCaption : "";
  const name = data ? data.name : "";
  const isShowProgressbar = data ? data.isShowProgressbar : false;
  const isShowQuestionsCount = data ? data.isShowQuestionsCount : false;

  return {
    pages,
    userAnswers,
    loading,
    error,
    location,
    slideMoveDirection,
    page: currentPage,
    pageIndex,
    emptyData,
    params,
    greetingsPage,
    completionPage,
    disqualificationPage,
    buttonStartCaption,
    buttonBackCaption,
    buttonFinishCaption,
    buttonNextCaption,
    name,
    isShowProgressbar,
    isShowQuestionsCount,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    fetchData: () => dispatch({ type: FETCH_SURVEY_DATA }),
    startSurvey: () => dispatch({ type: START_SURVEY }),
    completeSurvey: () => {
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
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Desktop);
