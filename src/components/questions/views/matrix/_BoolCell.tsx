import React from "react";
import GreenRadio from "../../../common/GreenRadio";
import { tdCss } from "./sc";

type IBoolCellProps = {
  isChecked: boolean;
  rowDocID: number;
  columnDocID: number;
  handleClick: (rowDocID: number, columnDocID: number) => void;
  title: string;
};

const BoolCell: React.FC<IBoolCellProps> = ({
  isChecked,
  handleClick,
  rowDocID,
  columnDocID,
  title,
}) => {
  //<td
  //   css={tdCss(isChecked, title)}
  //   onClick={() => handleClick(rowDocID, columnDocID)}
  // >
  return (
    <div
      css={tdCss(isChecked, title)}
      onClick={() => handleClick(rowDocID, columnDocID)}
    >
      <GreenRadio checked={isChecked} />
    </div>
  );
};

export default BoolCell;
