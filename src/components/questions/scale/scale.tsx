import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { setAnswer } from "../../../services/redux/actions";
import { IAnswer, IState } from "../../../types";
import { ICommonQuestionProps } from "../common-question.types";
import { optionCss, optionsCss, rootCss } from "./scale-sc";
import StarOutlineIcon from "@material-ui/icons/StarOutline";
import StarIcon from "@material-ui/icons/Star";
import tinygradient from "tinygradient";
import { getSmileys } from "./svg/smileys";

type IStateProps = ReturnType<typeof mapStateToProps>;
type IDispatchProps = ReturnType<typeof mapDispathToProps>;
type IScaleProps = IStateProps & IDispatchProps & ICommonQuestionProps;

export type IViewType =
  | "stars"
  | "table"
  | "color"
  | "smiles"
  | "smiles-monochrome";

const Scale: React.FC<IScaleProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, title, config } = question;
  const options = config.options!;
  const label = `${currentQuestionIndex + 1}. ${title}`;
  const selected =
    userAnswer && userAnswer.values.length > 0 ? userAnswer.values[0] : null;
  const selectedIndex =
    selected !== null
      ? options.findIndex((item) => item.docID === selected.optionID)
      : null;
  const horizontal = true;
  const viewType = "smiles-monochrome" as IViewType;

  const onClick = (item: typeof options[0]) => {
    const values =
      selected && selected.optionID === item.docID
        ? []
        : [{ optionID: item.docID, value: "" }];
    setAnswer({
      questionID: docID,
      values: values,
    });
  };
  const colors =
    options.length < 3
      ? ["#F41318", "#69CF63"]
      : tinygradient(["#F41318", "#FEDC81", "#69CF63"])
          .rgb(options.length)
          .map((el) => el.toString());
  const smileys = getSmileys(options.length);

  return (
    <FormControl css={rootCss}>
      <FormLabel component="legend">{label}</FormLabel>
      <div css={optionsCss(horizontal, viewType)}>
        {options.map((item, index) => {
          const checked = selected !== null && selected.optionID === item.docID;
          const beforeChecked = selectedIndex !== null && selectedIndex > index;
          const resolvedChecked =
            viewType === "stars" ? checked || beforeChecked : checked;

          return (
            <div
              key={item.docID}
              css={optionCss(resolvedChecked, viewType, colors[index])}
              onClick={() => onClick(item)}
            >
              {viewType === "stars" ? (
                resolvedChecked ? (
                  <StarIcon />
                ) : (
                  <StarOutlineIcon />
                )
              ) : viewType === "table" || viewType === "color" ? (
                item.title
              ) : viewType === "smiles" || viewType === "smiles-monochrome" ? (
                smileys[index]
              ) : null}
            </div>
          );
        })}
      </div>
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

export default connect(mapStateToProps, mapDispathToProps)(Scale);
