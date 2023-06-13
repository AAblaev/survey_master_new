import React, { useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
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
import {
  DEFAULT_BACKGROUND_COLOR,
  PRIMARY_COLOR,
  TIMEOUT_VALUE,
} from "./consts/const";
import Survey from "./components/pages/Survey";
import Page from "./components/pages/Page";
import { Modal, ModalHeader, ModalContent } from "./components/common/modal";
import { changeCurretLocation } from "./services/redux/actions";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  START_SURVEY,
  TOGGLE_MODAL_VISIBLE,
} from "./services/redux/types";
import ProgressBar from "./components/common/ProgressBar";
import InfoPage from "./components/pages/InfoPage";
import bottomBtnRender from "./components/common/renderBottomBtns";
import ProgressLinear from "./components/common/ProgressLinear";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  findFirstIncompleteQuestion,
  isQuestionDone,
} from "./utils/questionIsDone";
import contentBtnRender from "./components/common/renderContentBtns";
import Nav from "./components/common/Nav";

export type IDesktop = ConnectedProps<typeof connector>;

export const desctopCss = css`
  background-color: ${DEFAULT_BACKGROUND_COLOR};
  width: 100%;
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
  margin-top: 56px;
  margin-bottom: 56px;
  height: calc(100% - 112px);
  // display: flex;
  // flex-direction: column;

  @media (min-width: 768px) {
    margin-top: 64px;
    margin-bottom: 0px;
    height: calc(100% - 64px);
  }
  // display: flex;
  // flex-direction: column;
  // align-items: center;
`;

export const homeButtonCss = css`
  background-color: #3b424a;
  &.MuiButton-root {
    color: #fff;
  }
`;

export const onlyDesctopButtonCss = css`
  &.MuiButtonBase-root {
    display: none;
  }

  @media (min-width: 768px) {
    &.MuiButtonBase-root {
      display: inline-flex;
    }
  }
`;

export const transitionGroupCss = css`
  padding-bottom: 40px;
  & > div {
    box-sizing: border-box;
  }
`;

export const modalHeaderWrapperCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const gridContainerCss = css`
  flex-grow: 1;
  position: relative;
  display: grid;
  grid-template-columns: 15% auto 15%;
  grid-template-rows: auto;

  @media (min-width: 576px) {
    grid-template-columns: 5% auto 5%;
  }

  @media (min-width: 768px) {
    grid-template-columns: 10% auto 10%;
  }

  @media (min-width: 992px) {
    grid-template-columns: 15% auto 15%;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 20% auto 20%;
  }
`;

const borderCss = css`
  background-color: ${DEFAULT_BACKGROUND_COLOR};
  z-index: 20;
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
  submit,
  page,
  pageIndex,
  fetchData,
  startSurvey,
  greetingsPage,
  buttonStartCaption,
  buttonBackCaption,
  buttonFinishCaption,
  buttonNextCaption,
  completionPage,
  isShowProgressbar,
  isShowQuestionsCount,
  questionCount,
  modalVisible,
  openModal,
  closeModal,
}) => {
  const { title, pathName } = location;

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
    if (pathName === "greeting")
      return (
        <div>
          <InfoPage html={greetingsPage} />
          <Button
            key="start"
            variant="contained"
            css={onlyDesctopButtonCss}
            onClick={() => {
              handleClick({
                location: {
                  pageIndex: 0,
                  questionIndex: 0,
                  pathName: "survey",
                  title: "survey",
                },
                slideMoveDirection: "right-to-left",
                needSendAnswers: false,
              });
              startSurvey();
            }}
          >
            {buttonStartCaption}
          </Button>
        </div>
      );
    if (pathName === "completion") return <InfoPage html={completionPage} />;
    if (pathName === "survey") return <Survey />;
    if (pathName === "section")
      return (
        <div>
          <Page
            page={page}
            pageIndex={pageIndex}
            questionCount={questionCount}
          />
          {pathName === "section" && pageIndex + 1 === pages.length && (
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

  const resultValidation = findFirstIncompleteQuestion(pages, userAnswers);
  // console.log("allRequiredQuestionDone", allRequiredQuestionDone);

  const completeSurvey = () => {
    if (!resultValidation) {
      submit();
      return;
    }
    openModal();
  };

  const perfectScrollbarRef = useRef<any>(null);
  const perfectScrollbarContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          <>
            <Button
              key="home"
              css={homeButtonCss}
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
            <Nav
              title={page.title ? page.title : `Страница ${pageIndex + 1}`}
              pages={pages}
              currentPageIndex={pageIndex}
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
          </>
        )}
      </AppBar>

      <div css={contentCss}>
        {contentBtnRender({
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
          <div css={gridContainerCss}>
            <div css={borderCss}></div>
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
            <div css={borderCss}></div>
          </div>
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

      <Modal visible={modalVisible} onClosed={closeModal} size="sm">
        <ModalHeader>
          <div css={modalHeaderWrapperCss}>
            <span>Отмена</span>
            <IconButton onClick={() => closeModal()}>
              <CloseIcon />
            </IconButton>
          </div>
        </ModalHeader>
        <ModalContent>
          <div>Пожауйста, ответьте на обязательные вопросы</div>
        </ModalContent>
      </Modal>
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
    modalVisible,
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
  const questionCount: number = pages.reduce((acc: number, page, index) => {
    if (index < pageIndex) {
      return acc + page.questions.length;
    } else return acc;
  }, 0);
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
    questionCount,
    modalVisible,
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
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Desktop);
