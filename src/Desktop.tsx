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
  location,
  slideMoveDirection,
  handleForwardClick,
  handleBackClick,
}) => {
  const { title } = location;
  const dispatch = useDispatch();
  const [prevLocation, nextLocation] = getPrevAndNextLocation(location);

  // console.log("Desktop render");

  useEffect(() => {
    dispatch({ type: "FETCH_SURVEY_DATA" });
  }, [dispatch]);
  return (
    <div css={desctopCss}>
      <AppBar direction="top" fixed>
        <div>AppBarTop</div>
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
            {title === "campaning" ? <Survey /> : <Page />}
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
          Вперед
        </Button>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const { location, slideMoveDirection } = state;
  return {
    location,
    slideMoveDirection,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    handleForwardClick: (location: ILocation) =>
      dispatch(
        changeCurretLocation({
          location: location,
          slideMoveDirection: "right-to-left",
        })
      ),
    handleBackClick: (location: ILocation) =>
      dispatch(
        changeCurretLocation({
          location: location,
          slideMoveDirection: "left-to-right",
        })
      ),
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Desktop);
