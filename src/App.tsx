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
  modalVisible,
  closeModal,
  selectPage,
}) => {
  console.log("render");
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
        modalVisible={modalVisible}
        closeModal={closeModal}
        selectPage={selectPage}
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
    closeModal: () => dispatch({ type: TOGGLE_MODAL_VISIBLE, payload: false }),
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
