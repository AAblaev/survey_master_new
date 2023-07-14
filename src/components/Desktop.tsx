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
  gridContainerCss,
  homeButtonCss,
  modalHeaderWrapperCss,
  onlyDesctopButtonCss,
  transitionGroupCss,
} from "../sc";
import Nav from "./common/Nav";
import contentBtnRender from "./common/renderContentBtns";
import {
  findFirstIncompleteQuestion,
  isQuestionDone,
} from "../utils/questionIsDone";
import ProgressLinear from "./common/ProgressLinear";
import { TIMEOUT_VALUE } from "../consts/const";
import InfoPage from "./pages/InfoPage";
import Survey from "./pages/Survey";
import Section from "./pages/Section";
import bottomBtnRender from "./common/renderBottomBtns";
import Greeting from "./pages/Greeting";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";

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
  data: IData;
};

const Desktop: React.FC<IDesktop> = ({
  data,
  userAnswers,
  location,
  slideMoveDirection,
  handleClick,
  submit,
  startSurvey,
  modalVisible,
  openModal,
  closeModal,
}) => {
  const { title, pathName, pageIndex } = location;

  const {
    isShowPageList,
    pages,
    buttonStartCaption,
    buttonNextCaption,
    buttonBackCaption,
    buttonFinishCaption,
    isShowProgressbar,
    greetingsPage,
    completionPage,
    name,
  } = data;
  const isLimitTimeForCompletion = true;
  const limitTime = 3600;
  const limitTo = useMemo(() => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + limitTime);
    return date;
  }, [limitTime]);
  const diffInHours = useMemo(() => {
    return Math.abs(new Date().getTime() - limitTo.getTime()) / 3600000;
  }, [limitTo]);
  const countdownRenderMap: [
    boolean,
    boolean,
    boolean,
    boolean
  ] = useMemo(() => {
    return [diffInHours >= 24, diffInHours >= 1, true, true];
  }, [diffInHours]);

  const pagesCount = pages.length;
  const currentPage = pages[pageIndex];
  const resultValidation = findFirstIncompleteQuestion(pages, userAnswers);
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

  const showFinishBtn =
    pathName === "section" && pageIndex + 1 === pages.length;

  const completeSurvey = () => {
    if (!resultValidation) {
      submit();
      return;
    }
    openModal();
  };
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
    if (pathName === "survey") return <Survey />;
    if (pathName === "section")
      return (
        <Section
          page={currentPage}
          pageIndex={pageIndex}
          questionCount={questionCount}
          showFinishBtn={showFinishBtn}
          buttonFinishCaption={buttonFinishCaption}
          completeSurvey={completeSurvey}
        />
      );

    return null;
  };

  return (
    <>
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
                title={
                  currentPage.title
                    ? currentPage.title
                    : `Страница ${pageIndex + 1}`
                }
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
        {(pathName === "survey" || pathName === "section") &&
          isLimitTimeForCompletion && (
            <div css={{ marginLeft: "auto" }}>
              <FlipClockCountdown
                to={limitTo}
                renderMap={countdownRenderMap}
                digitBlockStyle={{
                  width: 25,
                  height: 40,
                  fontSize: 20,
                }}
                separatorStyle={{
                  size: 4,
                }}
                dividerStyle={{
                  height: 0,
                }}
                showLabels={false}
                onComplete={() => {
                  console.log("countdown complete");
                }}
              />
            </div>
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
        <div style={{}}>
          <TestMap>
            <div>Ghbdt</div>
          </TestMap>
        </div>
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
    </>
  );
};

export default Desktop;
