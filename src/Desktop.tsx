import React, { useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
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
import { TIMEOUT_VALUE } from "./consts/const";
import Survey from "./components/pages/Survey";
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
import {
  borderCss,
  contentCss,
  desctopCss,
  gridContainerCss,
  homeButtonCss,
  modalHeaderWrapperCss,
  onlyDesctopButtonCss,
  transitionGroupCss,
} from "./sc";
import Section from "./components/pages/Section";

export type IDesktop = ConnectedProps<typeof connector>;

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
  isShowPageList,
  isShowProgressbar,
  questionCount,
  modalVisible,
  openModal,
  closeModal,
}) => {
  const { title, pathName } = location;

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
        </div>
      );
    if (pathName === "completion") return <InfoPage html={completionPage} />;
    if (pathName === "survey") return <Survey />;
    if (pathName === "section")
      return (
        <div>
          <Section
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
    (acc: number, page: IPage) =>
      (acc += page.questions.filter((q) => q.config.dataType !== "textblock")
        .length),
    0
  );

  const allQuestionsDoneCount = Object.values(userAnswers).filter(
    isQuestionDone
  ).length;

  //???
  const resultValidation = findFirstIncompleteQuestion(pages, userAnswers);

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
    emptyData && fetchData();
  }, [fetchData, emptyData]);

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
            {isShowPageList ? (
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
            ) : (
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
            )}
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
          isShowPageList,
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
          isShowPageList,
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
  const isShowPageList = data ? data.isShowPageList : false;
  const questionCount: number = pages.reduce((acc: number, page, index) => {
    if (index < pageIndex) {
      return (
        acc +
        page.questions.filter((q) => q.config.dataType !== "textblock").length
      );
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
    isShowPageList,
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
