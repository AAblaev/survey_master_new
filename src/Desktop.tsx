import React, { useEffect } from "react";
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
import getPrevAndNextLocation from "./utils/getPrevAndNextLocation";
import {
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  START_SURVEY,
} from "./services/redux/types";
import ProgressBar from "./components/common/ProgressBar";
import GreetingPage from "./components/pages/GreetingPage";
import bottomBtnRender from "./components/common/renderBottomBtns";
import ProgressLinear from "./components/common/ProgressLinear";

export type IDesktop = ConnectedProps<typeof connector>;

export const desctopCss = css`
  background-color: ${DEFAULT_BACKGROUND_COLOR};
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  align-items: center;
  //
  // // Устройства Small (телефоны с горизонтальной ориентацией, 576 пикселей и выше)
  // @media (min-width: 576px) {
  //   width: 50%;
  // }
  //
  // // Устройства Medium (планшеты, 768 пикселей и выше)
  // @media (min-width: 768px) {
  //   width: 50%;
  // }
  //
  // // Устройства Large (настольные компьютеры, 992 пикселей и выше)
  // @media (min-width: 992px) {
  //   width: 50%;
  // }
  //
  // // Устройства X-Large (большие настольные компьютеры, 1200 пикселей и выше)
  // @media (min-width: 1200px) {
  //   width: 50%;
  // }
  //
  // // Устройства XX-Large (большие настольные компьютеры, 1400 пикселей и выше)
  // @media (min-width: 1400px) {
  //   width: 50%;
  // }
`;

export const contentCss = css`
  flex: 1 0 auto;
  padding-bottom: 64px;
  width: 100%;
`;

export const buttonCss = css`
  background-color: #3b424a;
  &.MuiButton-root {
    color: #fff;
  }
`;

const Desktop: React.FC<IDesktop> = ({
  pages,
  userAnswers,
  loading,
  error,
  emptyData,
  location,
  slideMoveDirection,
  handleClick,
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
  // completionPage,
  // disqualificationPage,
}) => {
  const { title, pathName } = location;

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (emptyData) {
      return;
    }
    startSurvey();
  }, [emptyData]);

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
    if (pathName === "greeting") return <GreetingPage html={greetingsPage} />;
    if (pathName === "survey") return <Survey />;
    if (pathName === "section")
      return <Page page={page} pageIndex={pageIndex} />;
    return null;
  };

  const allQuestionCount = pages.reduce(
    (acc: number, page: IPage) => (acc += page.questions.length),
    0
  );

  const allQuestionsDoneCount = Object.values(userAnswers).filter(
    (ans) => ans.values.length !== 0
  ).length;

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
      {pathName !== "greeting" && (
        <ProgressLinear
          allQuestionCount={allQuestionCount}
          allQuestionsDoneCount={allQuestionsDoneCount}
        />
      )}
      <div css={contentCss}>
        <TransitionGroup
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
          >
            {slideRender(pathName)}
          </CSSTransition>
        </TransitionGroup>
      </div>
      <AppBar direction="bottom" fixed>
        {bottomBtnRender({
          location,
          buttonStartCaption,
          buttonNextCaption,
          buttonBackCaption,
          buttonFinishCaption,
          handleClick,
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
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    fetchData: () => dispatch({ type: FETCH_SURVEY_DATA }),
    startSurvey: () => dispatch({ type: START_SURVEY }),
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
      // needSendAnswers && dispatch({ type: SEND_SURVEY_DATA });
    },
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Desktop);
