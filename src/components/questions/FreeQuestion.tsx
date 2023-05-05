import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import { setAnswer } from "../../services/redux/actions";
import { IQuestion, IState } from "../../types";
import { freeQuestionCss } from "./sc";

export type OwnProps = {
  key: number;
  currentQuestionIndex: number;
  question: IQuestion;
};
export type StateProps = ReturnType<typeof mapStateToProps>;
export type DispatchProps = ReturnType<typeof mapDispathToProps>;

type IFreeQuestionProps = StateProps & OwnProps & DispatchProps;

const FreeQuestion: React.FC<IFreeQuestionProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, title, pageID, surveyID } = question;
  const value = userAnswer.length === 0 ? "" : userAnswer[0].value;

  return (
    <FormControl css={freeQuestionCss}>
      <FormLabel id={String(docID)} component="legend">
        {currentQuestionIndex + 1}. {title}
      </FormLabel>

      <TextField
        id="outlined-multiline-static"
        InputProps={{ disableUnderline: true }}
        label="Ответ"
        color="primary"
        fullWidth
        multiline
        minRows={6}
        variant="filled"
        value={value}
        onChange={(e) => {
          setAnswer({
            docID: docID,
            value: [
              { value: e.target.value, questionID: docID, pageID, surveyID },
            ],
          });
        }}
      />
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

export default connect(mapStateToProps, mapDispathToProps)(FreeQuestion);
