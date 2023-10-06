import React from "react";
import { IState } from "../../types";
import { onlyDesctopButtonCss } from "../../sc";
import { Button } from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { buttonsWrapperCss, greatingPageCss } from "./sc";
import { START_SURVEY } from "../../services/redux/types";

type IGreetingProps = {
  html: string;
  buttonStartCaption: string;
};

export type IOwnGreetingProps = IGreetingProps &
  ConnectedProps<typeof connector>;

const Greeting: React.FC<IOwnGreetingProps> = ({
  html,
  buttonStartCaption,
  uid,
  startSurvey,
  continueSurvey,
}) => {
  return (
    <div css={greatingPageCss}>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
      <div css={buttonsWrapperCss}>
        <Button
          key="start"
          variant={uid ? "outlined" : "contained"}
          css={onlyDesctopButtonCss}
          color={uid ? "primary" : undefined}
          onClick={startSurvey}
        >
          {uid ? "начать заново" : buttonStartCaption}
        </Button>
        {uid && (
          <Button
            key="continue"
            variant="contained"
            css={onlyDesctopButtonCss}
            onClick={continueSurvey}
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
  return {
    startSurvey: () => dispatch({ type: START_SURVEY, isContinue: false }),
    continueSurvey: () => dispatch({ type: START_SURVEY, isContinue: true }),
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Greeting);
