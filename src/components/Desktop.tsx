import React, { useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  ILocation,
  IUserAnswer,
  ISlideMoveDirection,
  IData,
  IPage,
  IPathName,
  IStyles,
} from "../types";
import AppBar from "./common/AppBar";
import { Modal } from "./common/modal";
import {
  borderCss,
  contentCss,
  footerCss,
  gridContainerCss,
  surveyNameCss,
  transitionGroupCss,
} from "../sc";
import { isQuestionDone } from "../utils/questionIsDone";
import ProgressLinear from "./common/ProgressLinear";
import { TIMEOUT_VALUE } from "../consts/const";
import InfoPage from "./pages/InfoPage";
import Survey from "./pages/Survey";
import Section from "./pages/Section";
import Greeting from "./pages/Greeting";
import Menu from "./connected/Menu";
import ModalContentComponent from "./connected/ModalContentsComponent";
import Switcher from "./connected/switcher";
import Timer from "./common/Timer";
import Notifications from "./common/Notifications";
import Typography from "@mui/material/Typography";

type IDesktop = {
  userAnswers: IUserAnswer;
  location: ILocation;
  slideMoveDirection: ISlideMoveDirection;
  modalVisible: boolean;
  closeModal: () => void;
  selectPage: (pageID: string) => void;
  data: IData;
  brandColor: string;
  backgroundColor: string;
  appBarStyles: IStyles["componentsStyle"]["appBar"];
  isShowSurveyName: boolean;
  completeSurveyByTimer: () => void;
  timerTime: number;
};

const completionByTimerPage =
  "<p><strong>Опрос был завершён из-за истечения отведённого времени.</strong></p><p><strong>Благодарим Вас за честные ответы и потраченное время!</strong></p>";

const Desktop: React.FC<IDesktop> = ({
  data,
  userAnswers,
  location,
  slideMoveDirection,
  modalVisible,
  closeModal,
  selectPage,
  brandColor,
  backgroundColor,
  appBarStyles,
  isShowSurveyName,
  completeSurveyByTimer,
  timerTime,
}) => {
  const { title, pathName, pageIndex } = location;
  const {
    pages,
    buttonStartCaption,
    isShowProgressbar,
    greetingsPage,
    completionPage,
    byTimerPage,
    disqualificationPage,
    name,
    isLimitTimeForCompletion,
    isShowQuestionsCount,
  } = data;

  // перенести в Таймер
  const showTimer =
    (pathName === "survey" || pathName === "section") &&
    isLimitTimeForCompletion;

  const currentPage = pages[pageIndex];
  // перенести в Таймерэ

  // перенести в ProgressLinear -->
  const allQuestionCount = pages.reduce(
    (acc: number, page: IPage) =>
      (acc += page.questions.filter((q) => q.config.dataType !== "textblock")
        .length),
    0
  );

  const allQuestionsDoneCount = Object.values(userAnswers).filter(
    isQuestionDone
  ).length;

  //<-- перенести в ProgressLinear

  const perfectScrollbarRef = useRef<any>(null);
  const perfectScrollbarContainerRef = useRef<HTMLElement | null>(null);

  const slideRender = (pathName: IPathName) => {
    if (pathName === "greeting")
      return (
        <Greeting
          html={greetingsPage}
          buttonStartCaption={buttonStartCaption}
        />
      );
    if (pathName === "completion") return <InfoPage html={completionPage} />;
    if (pathName === "completion_by_timer")
      return <InfoPage html={byTimerPage} />;

    if (pathName === "disqualification")
      return <InfoPage html={disqualificationPage} />;

    if (pathName === "survey")
      return (
        <Survey
          pages={pages}
          userAnswers={userAnswers}
          selectPage={selectPage}
          isShowQuestionsCount={isShowQuestionsCount}
        />
      );
    if (pathName === "section") return <Section page={currentPage} />;
    return null;
  };

  return (
    <>
      <AppBar direction="top" appBarStyles={appBarStyles} fixed>
        <Menu />
        <Switcher />
        {isShowSurveyName && (
          <Typography css={surveyNameCss(pathName === "survey")}>
            {name}
          </Typography>
        )}

        {showTimer && (
          <Timer
            limitTime={timerTime}
            brandColor={brandColor}
            completeSurveyByTimer={completeSurveyByTimer}
          />
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
          <div style={{ height: "15px" }}></div>

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
            <div css={borderCss(backgroundColor)}></div>
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
            <div css={borderCss(backgroundColor)}></div>
          </div>
        </PerfectScrollbar>
      </div>
      <footer css={footerCss(brandColor)}></footer>
      <Notifications location={location} />

      <Modal visible={modalVisible} onClosed={closeModal} size="sm">
        <ModalContentComponent closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default Desktop;
