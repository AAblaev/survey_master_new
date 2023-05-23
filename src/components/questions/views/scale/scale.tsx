import React from "react";
import { IAnswer, IQuestion } from "../../../../types";
import { optionCss, optionsCss } from "./scale-sc";
import StarOutlineIcon from "@material-ui/icons/StarOutline";
import StarIcon from "@material-ui/icons/Star";
import tinygradient from "tinygradient";
import { getSmileys } from "./svg/smileys";
import { css } from "@emotion/react";

export const freeListItemCss = css`
  margin-top: 10px !important;
  margin-bottom: 10px !important;
`;

export const freeListItemLabelCss = css`
  font-size: 1.2em !important;
  color: #787878 !important;
`;

type IScaleViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
};

const ScaleView: React.FC<IScaleViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const options = config.options!;
  const orientation = config.orientation!;
  const view = config.view!;

  const selected =
    userAnswer && userAnswer.values.length > 0 ? userAnswer.values[0] : null;
  const selectedIndex =
    selected !== null
      ? options.findIndex((item) => item.docID === selected.optionID)
      : null;
  // const orientation = "horizontal" as IOrientation;
  // const view = "smiles-monochrome" as IView;

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
    <div css={optionsCss(orientation, view)}>
      {options.map((item, index) => {
        const checked = selected !== null && selected.optionID === item.docID;
        const beforeChecked = selectedIndex !== null && selectedIndex > index;
        const resolvedChecked =
          view === "stars" ? checked || beforeChecked : checked;

        return (
          <div
            key={item.docID}
            css={optionCss(resolvedChecked, view, colors[index])}
            onClick={() => onClick(item)}
          >
            {view === "stars" ? (
              resolvedChecked ? (
                <StarIcon />
              ) : (
                <StarOutlineIcon />
              )
            ) : view === "table" || view === "color" ? (
              item.title
            ) : view === "smiles" || view === "smiles-monochrome" ? (
              smileys[index]
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ScaleView;
