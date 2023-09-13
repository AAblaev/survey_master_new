import React, { useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import "./assets/index.css";
import { ILocation, ISlideMoveDirection, IState } from "./types";
import { Dispatch } from "redux";
import {
  changeCurretLocation,
  setNeedScrolling,
} from "./services/redux/actions";
import AppBar from "./components/common/AppBar";
import ProgressBar from "./components/common/ProgressBar";
import Desktop from "./components/Desktop";
import { contentCss, desctopCss } from "./sc";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  TOGGLE_MODAL_VISIBLE,
} from "./services/redux/types";

export type IApp = ConnectedProps<typeof connector>;

const App: React.FC<IApp> = ({
  loading,
  error,
  fetchData,
  data,
  userAnswers,
  location,
  slideMoveDirection,
  handleClick,
  submit,
  modalVisible,
  openModal,
  closeModal,
  selectPage,
  setScrolling,
  needScrolling,
}) => {
  useEffect(() => {
    !data && fetchData();
  }, [fetchData, data]);

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

  if (!data) {
    return null;
  }

  return (
    <div css={desctopCss}>
      {loading && (
        <ProgressBar
          position={"absolute"}
          background={"rgba(255, 255, 255, 0.5)"}
        />
      )}
      <Desktop
        data={data}
        userAnswers={userAnswers}
        location={location}
        slideMoveDirection={slideMoveDirection}
        handleClick={handleClick}
        submit={submit}
        modalVisible={modalVisible}
        openModal={openModal}
        closeModal={closeModal}
        selectPage={selectPage}
        setScrolling={setScrolling}
        needScrolling={needScrolling}
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
    visitedPageDocIDList,
    needScrolling,
  } = state;

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
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    fetchData: () => dispatch({ type: FETCH_SURVEY_DATA }),
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
    selectPage: (index: number) => {
      dispatch(
        changeCurretLocation({
          location: {
            pageIndex: index,
            pathName: "section",
            questionIndex: 0,
            title: "section",
          },
          slideMoveDirection: "right-to-left",
        })
      );
    },
    setScrolling: (value: boolean) => dispatch(setNeedScrolling(value)),
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(App);
