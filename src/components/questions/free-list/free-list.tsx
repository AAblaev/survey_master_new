import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { setAnswer } from "../../../services/redux/actions";
import { IState } from "../../../types";
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
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    item: typeof options[0]
  ) => {
    const values = (userAnswer.length > 0 ? userAnswer : options).map(
      (answer) => ({
        ...answer,
        value:
          answer.docID === item.docID ? e.target.value : answer.value || "",
        questionID: docID,
        pageID,
        surveyID,
      })
    );
    setAnswer({
      docID: docID,
      value: values,
    });
  };

  return (
    <FormControl css={freeQuestionCss}>
      <FormLabel component="legend">{freeListLabel}</FormLabel>
      {options.map((item, i) => {
        const answer = userAnswer.find((answer) => answer.docID === item.docID);
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
  return { userAnswer: userAnswers[docID] ? userAnswers[docID] : [] };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    setAnswer: ({ docID, value }: { docID: number; value: any[] }) => {
      dispatch(setAnswer({ docID, value }));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(FreeList);
