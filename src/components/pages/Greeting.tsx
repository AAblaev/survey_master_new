import React from "react";
import {
  ILocation,
  IParsedData,
  ISlideMoveDirection,
  IState,
} from "../../types";
import { onlyDesctopButtonCss } from "../../sc";
import { Button } from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import {
  deleteUserAnswers,
  setNeedScrolling,
} from "../../services/redux/actions";
import { buttonsWrapperCss, greatingPageCss } from "./sc";
import { findFirstIncompleteQuestion } from "../../utils/questionIsDone";

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
  firstIncompleteQuestion,
  setScrolling,
}) => {
  const notFirstEntering = Boolean(firstIncompleteQuestion);

  return (
    <div css={greatingPageCss}>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
      <div css={buttonsWrapperCss}>
        <Button
          key="start"
          variant={uid ? "outlined" : "contained"}
          css={onlyDesctopButtonCss}
          color={uid ? "primary" : undefined}
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
              setScrolling(true);
              handleClick({
                location: {
                  pageIndex: notFirstEntering
                    ? firstIncompleteQuestion!.pageIndex
                    : 0,
                  questionIndex: notFirstEntering
                    ? firstIncompleteQuestion!.questionIndex
                    : 0,
                  pathName: notFirstEntering
                    ? "section"
                    : isShowPageList
                    ? "survey"
                    : "section",
                  title: notFirstEntering
                    ? "section"
                    : isShowPageList
                    ? "survey"
                    : "section",
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
  const { params, userAnswers, data: notNullData } = state;
  const { uid } = params;
  const data = notNullData as IParsedData;
  const { pages } = data;
  const firstIncompleteQuestion = findFirstIncompleteQuestion(
    pages,
    userAnswers
  );

  return { uid, firstIncompleteQuestion };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  const deleteAnswers = () => {
    dispatch(deleteUserAnswers());
  };
  const setScrolling = (value: boolean) => {
    dispatch(setNeedScrolling(value));
  };
  return { deleteAnswers, setScrolling };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Greeting);
