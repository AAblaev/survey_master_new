import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import "./assets/index.css";
import { IState } from "./types";
import { Dispatch } from "redux";
import {
  completeByTymer,
  selectSection,
  setNeedScrolling,
} from "./services/redux/actions";
import AppBar from "./components/common/AppBar";
import ProgressBar from "./components/common/ProgressBar";
import Desktop from "./components/Desktop";
import { contentCss, desctopCss } from "./sc";
import {
  FETCH_SURVEY_DATA,
  TOGGLE_MODAL_VISIBLE,
} from "./services/redux/types";
import ErrorComponent from "./components/ErrorComponent";

export type IApp = ConnectedProps<typeof connector>;

const App: React.FC<IApp> = ({
  loading,
  error,
  fetchData,
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
  showTimer,
}) => {
  useEffect(() => {
    !data && fetchData();
  }, [fetchData, data]);

  // console.log("userAnswers", userAnswers);
  if (error.status) {
    return (
      <div css={desctopCss(backgroundColor)}>
        <AppBar appBarStyles={appBarStyles} direction="top" fixed></AppBar>
        <div css={contentCss}>
          <ErrorComponent
            message={error.message}
            backgroundColor={backgroundColor}
          />
        </div>
        <AppBar appBarStyles={appBarStyles} direction="bottom" fixed></AppBar>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div css={desctopCss(backgroundColor)}>
      {loading && (
        <ProgressBar
          position={"absolute"}
          background={"rgba(255, 255, 255, 0.5)"}
          brandColor={brandColor}
        />
      )}
      <Desktop
        data={data}
        userAnswers={userAnswers}
        location={location}
        slideMoveDirection={slideMoveDirection}
        modalVisible={modalVisible}
        closeModal={closeModal}
        selectPage={selectPage}
        brandColor={brandColor}
        backgroundColor={backgroundColor}
        appBarStyles={appBarStyles}
        isShowSurveyName={isShowSurveyName}
        completeSurveyByTimer={completeSurveyByTimer}
        timerTime={timerTime}
        showTimer={showTimer}
      />
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const {
    loading,
    error,
    location,
    slideMoveDirection,
    data,
    params,
    userAnswers,
    modalVisible,
    needScrolling,
    styles,
    timerTime,
    showTimer,
    visitedPageDocIDList,
    pageMovementLogs,
  } = state;

  console.log("visitedPageDocIDList", visitedPageDocIDList);
  console.log("pageMovementLogs", pageMovementLogs);

  const {
    globalStyle: {
      brandColor,
      background: { color: backgroundColor },
    },
    componentsStyle: { appBar: appBarStyles },
  } = styles;

  const isShowSurveyName = Boolean(data?.isShowSurveyName);

  return {
    userAnswers,
    loading,
    error,
    location,
    slideMoveDirection,
    params,
    modalVisible,
    data,
    needScrolling,
    brandColor,
    backgroundColor,
    appBarStyles,
    isShowSurveyName,
    timerTime,
    showTimer,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    fetchData: () => dispatch({ type: FETCH_SURVEY_DATA }),
    closeModal: () => dispatch({ type: TOGGLE_MODAL_VISIBLE, payload: false }),
    selectPage: (pageDocID: string) => dispatch(selectSection({ pageDocID })),
    completeSurveyByTimer: () => dispatch(completeByTymer()),
    setScrolling: (value: boolean) => dispatch(setNeedScrolling(value)),
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(App);
