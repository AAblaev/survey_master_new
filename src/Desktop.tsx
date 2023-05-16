import React, { useEffect } from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Button from "@material-ui/core/Button";

import { css } from "@emotion/react";
import "./assets/index.css";
import { ILocation, IState } from "./types";
import { Dispatch } from "redux";
import AppBar from "./components/common/AppBar";
import { TIMEOUT_VALUE } from "./consts/const";
import Survey from "./components/pages/Survey";
import Page from "./components/pages/Page";
import { changeCurretLocation } from "./services/redux/actions";
import getPrevAndNextLocation from "./utils/getPrevAndNextLocation";
import {
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  START_SURVEY,
} from "./services/redux/types";

export type IDesktop = ConnectedProps<typeof connector>;

export const desctopCss = css`
  background-color: #fff;
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
  padding-top: 64px;
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
  emptyData,
  location,
  slideMoveDirection,
  handleForwardClick,
  handleBackClick,
  page,
  pageIndex,
  params,
  fetchData,
  startSurvey,
}) => {
  const { title } = location;
  const [prevLocation, nextLocation] = getPrevAndNextLocation(location);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (emptyData) {
      return;
    }
    startSurvey();
  }, [emptyData]);
  return (
    <div css={desctopCss}>
      <AppBar direction="top" fixed>
        <Button
          css={buttonCss}
          onClick={() =>
            handleBackClick({
              pageIndex: 0,
              pathName: "",
              questionIndex: 0,
              title: "campaning",
            })
          }
        >
          К списку страниц
        </Button>
      </AppBar>
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
            {title === "campaning" ? (
              <Survey />
            ) : (
              <Page page={page} pageIndex={pageIndex} />
            )}
          </CSSTransition>
        </TransitionGroup>
      </div>
      <AppBar direction="bottom" fixed>
        <Button css={buttonCss} onClick={() => handleBackClick(prevLocation)}>
          Назад
        </Button>
        <Button
          css={buttonCss}
          onClick={() => handleForwardClick(nextLocation)}
        >
          {title === "campaning" ? "Вперед" : "Сохранить и вперед"}
        </Button>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const { location, slideMoveDirection, data, params } = state;

  const emptyData = !Boolean(data);
  const pages = data ? data.pages : [];
  const { pageIndex } = location;
  const currentPage = pages[pageIndex];

  return {
    location,
    slideMoveDirection,
    page: currentPage,
    pageIndex,
    emptyData,
    params,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    fetchData: () => dispatch({ type: FETCH_SURVEY_DATA }),
    startSurvey: () => dispatch({ type: START_SURVEY }),
    handleForwardClick: (location: ILocation) => {
      dispatch(
        changeCurretLocation({
          location: location,
          slideMoveDirection: "right-to-left",
        })
      );
      dispatch({ type: SEND_SURVEY_DATA });
    },
    handleBackClick: (location: ILocation) => {
      dispatch(
        changeCurretLocation({
          location: location,
          slideMoveDirection: "left-to-right",
        })
      );
    },
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Desktop);
