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

export type IDesktop = ConnectedProps<typeof connector>;

export const desctopCss = css`
  background-color: pink;
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const contentCss = css`
  flex: 1 0 auto;
  padding-top: 64px;
  padding-bottom: 64px;
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

  console.log("Desktop render");
  console.log(location);

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
            key={title}
            classNames="left-to-right"
            timeout={{ enter: TIMEOUT_VALUE, exit: TIMEOUT_VALUE }}
          >
            {title === "campaning" ? <Survey /> : <Page />}
          </CSSTransition>
        </TransitionGroup>
      </div>
      <AppBar direction="bottom" fixed>
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
          Назад
        </Button>
        <Button
          css={buttonCss}
          onClick={() =>
            handleForwardClick({
              pageIndex: 0,
              pathName: "",
              questionIndex: 0,
              title: "page",
            })
          }
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
          slideMoveDirection: "left-to-right",
        })
      ),
    handleBackClick: (location: ILocation) =>
      dispatch(
        changeCurretLocation({
          location: location,
          slideMoveDirection: "right-to-left",
        })
      ),
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Desktop);
