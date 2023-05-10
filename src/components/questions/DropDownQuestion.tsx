import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { setAnswer } from "../../services/redux/actions";
import { IQuestion, IState } from "../../types";
import { selectQuestionCss } from "./sc";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core";

type OwnProps = {
  key: number;
  currentQuestionIndex: number;
  question: IQuestion;
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispathToProps>;

type IFreeQuestionProps = StateProps & OwnProps & DispatchProps;

const SelectQuestion: React.FC<IFreeQuestionProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, title, pageID, surveyID, config } = question;
  const { dataType } = config;
  const options = config.options!;
  const isSelected = (docID: number) => {
    return userAnswer.some((ans) => ans.docID === docID);
  };

  const GreenCheckbox = withStyles({
    root: {
      color: "#46acaf",
      "&$checked": {
        color: "#46acaf",
      },
    },
    checked: {},
  })((props: CheckboxProps) => <Checkbox color="default" {...props} />);

  return (
    <FormControl css={selectQuestionCss} focused={false}>
      <FormLabel id={String(docID)} component="legend">
        {currentQuestionIndex + 1}. {title}
      </FormLabel>
    </FormControl>
  );
};

const mapStateToProps = (state: IState, props: OwnProps) => {
  const { userAnswers } = state;
  const { question } = props;
  const { docID } = question;
  return { userAnswer: userAnswers[docID] ? userAnswers[docID] : [] };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    setAnswer: ({ docID, value }: { docID: number; value: any[] }) => {
      dispatch(setAnswer({ docID, value }));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(SelectQuestion);
