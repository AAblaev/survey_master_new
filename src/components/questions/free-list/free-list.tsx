import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { setAnswer } from "../../../services/redux/actions";
import { IAnswer, IState } from "../../../types";
import { freeQuestionCss } from "../sc";
import { TextField } from "@material-ui/core";
import { ICommonQuestionProps } from "../common-question.types";
import { freeListItemCss, freeListItemLabelCss } from "./free-list-sc";

type IStateProps = ReturnType<typeof mapStateToProps>;
type IDispatchProps = ReturnType<typeof mapDispathToProps>;

type IFreeListProps = IStateProps & IDispatchProps & ICommonQuestionProps;

const FreeList: React.FC<IFreeListProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, title, config, pageID, surveyID } = question;
  const options = config.options!;
  const freeListLabel = `${currentQuestionIndex + 1}. ${title}`;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    item: typeof options[0]
  ) => {
    const values = options.map((option) => ({
      optionID: option.docID,
      value:
        option.docID === item.docID
          ? e.target.value
          : (userAnswerExist &&
              userAnswer.values.find((el) => el.optionID === option.docID)
                ?.value) ||
            "",
    }));
    setAnswer({
      questionID: docID,
      values: values,
    });
  };

  return (
    <FormControl css={freeQuestionCss}>
      <FormLabel component="legend">{freeListLabel}</FormLabel>
      {options.map((item, i) => {
        const answer = userAnswer?.values.find(
          (answer) => answer.optionID === item.docID
        );
        const label = `${currentQuestionIndex + 1}.${i + 1}. ${item.title}`;
        return (
          <FormControl key={item.docID} css={freeListItemCss}>
            <FormLabel component="legend" css={freeListItemLabelCss}>
              {label}
            </FormLabel>
            <TextField
              InputProps={{ disableUnderline: true }}
              color="primary"
              variant="filled"
              value={(answer && answer.value) || ""}
              hiddenLabel
              onChange={(e) => onChange(e, item)}
            />
          </FormControl>
        );
      })}
    </FormControl>
  );
};

const mapStateToProps = (state: IState, props: ICommonQuestionProps) => {
  const { userAnswers } = state;
  const { question } = props;
  const { docID } = question;
  return { userAnswer: userAnswers[docID] ? userAnswers[docID] : null };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    setAnswer: (answer: IAnswer) => dispatch(setAnswer(answer)),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(FreeList);
