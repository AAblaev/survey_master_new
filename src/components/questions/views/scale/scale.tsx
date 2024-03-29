import React from "react";
import { useSelector } from "react-redux";
import { optionCss, optionsCss } from "./scale-sc";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import tinygradient from "tinygradient";
import { getSmileys } from "./svg/smileys";
import { css } from "@emotion/react";
import { getBrandColor } from "../../../../services/redux/selectors";
import { IViewComponentProps } from "../..";

export const freeListItemCss = css`
  margin-top: 10px !important;
  margin-bottom: 10px !important;
`;

export const freeListItemLabelCss = css`
  font-size: 1.2em !important;
  color: #787878 !important;
`;

const ScaleView: React.FC<IViewComponentProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const { brandColor } = useSelector(getBrandColor);
  const options = config.options!;
  const orientation = config.orientation!;
  const view = config.view!;
  const selected =
    userAnswer && userAnswer.values.length > 0 ? userAnswer.values[0] : null;
  const selectedIndex =
    selected !== null
      ? options.findIndex((item) => item.docID === selected.optionID)
      : null;

  const onClick = (item: typeof options[0]) => {
    const values =
      selected && selected.optionID === item.docID
        ? []
        : [
            {
              optionID: item.docID,
              value: String(item.title),
              isFocused: false,
              validationResult: { isValid: true, message: "success" },
            },
          ];
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
            css={optionCss(resolvedChecked, view, colors[index], brandColor)}
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
