import React from "react";
import { ILocation, ISlideMoveDirection, IState } from "../../types";
import { onlyDesctopButtonCss } from "../../sc";
import { Button } from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { deleteUserAnswers } from "../../services/redux/actions";

type IGreetingProps = {
  html: string;
  startSurvey: () => void;
  isShowPageList: boolean;
  buttonStartCaption: string;
  handleClick: (payload: {
    location: ILocation;
    slideMoveDirection: ISlideMoveDirection;
    needSendAnswers: boolean;
  }) => void;
};

export type IOwnGreetingProps = IGreetingProps &
  ConnectedProps<typeof connector>;

const Greeting: React.FC<IOwnGreetingProps> = ({
  html,
  handleClick,
  isShowPageList,
  startSurvey,
  buttonStartCaption,
  uid,
  deleteAnswers,
}) => {
  return (
    <div style={{ paddingTop: "20px" }}>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
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
            deleteAnswers();
            startSurvey();
          }}
        >
          {uid ? "начать заново" : buttonStartCaption}
        </Button>
        {uid && (
          <Button
            key="continue"
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
            }}
          >
            Продолжить
          </Button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const { params } = state;
  const { uid } = params;
  return { uid };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  const deleteAnswers = () => {
    dispatch(deleteUserAnswers());
  };
  return { deleteAnswers };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Greeting);
