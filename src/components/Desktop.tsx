import React, { useEffect, useMemo, useRef } from "react";
import Button from "@material-ui/core/Button";
import PerfectScrollbar from "react-perfect-scrollbar";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import {
  ILocation,
  IUserAnswer,
  ISlideMoveDirection,
  IData,
  IPage,
  IPathName,
} from "../types";
import AppBar from "./common/AppBar";
import { Modal, ModalHeader, ModalContent } from "./common/modal";

import {
  borderCss,
  contentCss,
  footerCss,
  gridContainerCss,
  homeButtonCss,
  modalHeaderWrapperCss,
  transitionGroupCss,
} from "../sc";
import Nav from "./common/Nav";
import { isQuestionDone } from "../utils/questionIsDone";
import ProgressLinear from "./common/ProgressLinear";
import {
  DEFAULT_IS_LIMIT_TIME,
  PRIMARY_COLOR,
  TIMEOUT_VALUE,
} from "../consts/const";
import InfoPage from "./pages/InfoPage";
import Survey from "./pages/Survey";
import Section from "./pages/Section";
import Greeting from "./pages/Greeting";
import Menu from "./connected/Menu";
import Switcher from "./connected/switcher";
import Timer from "./common/Timer";

type IDesktop = {
  userAnswers: IUserAnswer;
  location: ILocation;
  slideMoveDirection: ISlideMoveDirection;
  modalVisible: boolean;
  handleClick: (payload: {
    location: ILocation;
    slideMoveDirection: ISlideMoveDirection;
    needSendAnswers: boolean;
  }) => void;
  submit: () => void;
  startSurvey: () => void;
  openModal: () => void;
  closeModal: () => void;
  selectPage: (index: number) => void;
  setScrolling: (value: boolean) => void;
  data: IData;
  needScrolling: boolean;
};

const Desktop: React.FC<IDesktop> = ({
  data,
  userAnswers,
  location,
  slideMoveDirection,
  handleClick,
  startSurvey,
  modalVisible,
  closeModal,
  selectPage,
  needScrolling,
}) => {
  const { title, pathName, pageIndex, questionIndex } = location;
  const {
    isShowPageList,
    pages,
    buttonStartCaption,
    isShowProgressbar,
    greetingsPage,
    completionPage,
    name,
    isLimitTimeForCompletion,
    limitTime,
  } = data;

  console.log("needScrolling", needScrolling);

  const showTimer =
    (pathName === "survey" || pathName === "section") &&
    isLimitTimeForCompletion;
  const currentPage = pages[pageIndex];
  const allQuestionCount = pages.reduce(
    (acc: number, page: IPage) =>
      (acc += page.questions.filter((q) => q.config.dataType !== "textblock")
        .length),
    0
  );
  //
  const questionCount: number = pages.reduce((acc: number, page, index) => {
    if (index < pageIndex) {
      return (
        acc +
        page.questions.filter((q) => q.config.dataType !== "textblock").length
      );
    } else return acc;
  }, 0);

  const allQuestionsDoneCount = Object.values(userAnswers).filter(
    isQuestionDone
  ).length;

  const perfectScrollbarRef = useRef<any>(null);
  const perfectScrollbarContainerRef = useRef<HTMLElement | null>(null);

  const slideRender = (pathName: IPathName) => {
    if (pathName === "greeting")
      return (
        <Greeting
          html={greetingsPage}
          buttonStartCaption={buttonStartCaption}
          handleClick={handleClick}
          isShowPageList={isShowPageList}
          startSurvey={startSurvey}
        />
      );
    if (pathName === "completion") return <InfoPage html={completionPage} />;
    if (pathName === "survey")
      return (
        <Survey
          pages={pages}
          userAnswers={userAnswers}
          selectPage={selectPage}
        />
      );
    if (pathName === "section")
      return <Section page={currentPage} questionCount={questionCount} />;

    return null;
  };
  //
  // useEffect(() => {
  //   if (needScrolling) {
  //     const currentQuestion = currentPage.questions[questionIndex];
  //     const element = perfectScrollbarContainerRef.current.querySelector(
  //       `#docID${currentQuestion.docID}`
  //     );
  //
  //     if (element && perfectScrollbarContainerRef.current) {
  //       // perfectScrollbarContainerRef.current.style.scrollBehavior = "smooth";
  //
  //       element.scrollIntoView();
  //       // console.log("Прокрутка с плавным скроллом", perfectScrollbarRef);
  //       //
  //       // const containerTop = perfectScrollbarContainerRef.current.getBoundingClientRect()
  //       //   .top;
  //       // const elementTop = element.getBoundingClientRect().top;
  //       // const offset = elementTop - containerTop;
  //       // console.log("Прокрутка с плавным скроллом", offset);
  //       // console.log("Прокрутка с плавным скроллом", perfectScrollbarRef);
  //       //
  //       // // Прокрутка с плавным скроллом
  //       // perfectScrollbarContainerRef.current.style.scrollBehavior = "smooth";
  //       // perfectScrollbarContainerRef.current.scrollTop += offset;
  //
  //       // Возвращаем стандартное поведение после прокрутки
  //       setTimeout(() => {
  //         perfectScrollbarContainerRef.current.style.scrollBehavior = "auto";
  //       }, 500); // Может потребоваться настроить задержку
  //     }
  //   }
  // }, [needScrolling]);

  return (
    <>
      <AppBar direction="top" fixed>
        <Menu />
        {showTimer && <Timer limitTime={limitTime} />}

        <Switcher />
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
            <div className="adaptive-paddings">
              <div className="survey-name">{name}</div>
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
      <footer css={footerCss}></footer>

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
    </>
  );
};

export default Desktop;
