import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { setAnswer } from "../../../services/redux/actions";
import { selectQuestionCss } from "../sc";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core";
import { IQuestion, IState, IAnswer } from "../../../types";

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

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;

  const valuesArr = userAnswerExist ? (userAnswer as IAnswer).values : [];
  const valuesIdArr: number[] = userAnswerExist
    ? valuesArr.map((item) => item.optionID)
    : [];

  const isSelected = (docID: number) => {
    return valuesIdArr.some((id) => id === docID);
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
      <FormGroup>
        {options.map((item, index) => {
          const isChecked = isSelected(item.docID);
          const handleChange = () => {
            setAnswer({
              questionID: docID,
              values: isChecked
                ? []
                : [{ optionID: item.docID, value: item.title }],
            });
          };

          const handleChange2 = () => {
            setAnswer({
              questionID: docID,
              values: isChecked
                ? valuesArr.filter((v) => v.optionID !== item.docID)
                : [...valuesArr, { optionID: item.docID, value: item.title }],
            });
          };

          return (
            <FormControlLabel
              control={
                <GreenCheckbox
                  checked={isChecked}
                  onChange={
                    dataType === "select" ? handleChange : handleChange2
                  }
                  name={item.title}
                />
              }
              label={item.title}
              key={index}
            />
          );
        })}
      </FormGroup>
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
    setAnswer: (answer: IAnswer) => dispatch(setAnswer(answer)),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(SelectQuestion);
