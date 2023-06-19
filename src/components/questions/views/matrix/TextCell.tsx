import TextField from "@material-ui/core/TextField";
import React from "react";
import { textFieldCellCss, titleTextFieldCellCss } from "./sc";

type ITextFieldCellProps = {
  rowDocID: number;
  columnDocID: number;
  handleChange: (rowDocID: number, columnDocID: number, value: string) => void;
  title: string;
  value: string;
};

const TextFieldCell: React.FC<ITextFieldCellProps> = ({
  handleChange,
  rowDocID,
  columnDocID,
  title,
  value,
}) => {
  return (
    <td css={textFieldCellCss}>
      <div css={titleTextFieldCellCss}>{title}</div>
      <TextField
        InputProps={{ disableUnderline: true }}
        hiddenLabel
        fullWidth
        color="primary"
        variant="filled"
        value={value}
        onChange={(e) => {
          handleChange(rowDocID, columnDocID, e.target.value);
        }}
      />
    </td>
  );
};

export default TextFieldCell;
