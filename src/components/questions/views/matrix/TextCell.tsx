import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ErrorIcon from "@material-ui/icons/Error";

import React from "react";
import { IConfig, IValue } from "../../../../types";
import { borderColorCss } from "../free-list";
import { textFieldCellCss, titleTextFieldCellCss } from "./sc";

type ITextFieldCellProps = {
  rowDocID: number;
  columnDocID: number;
  handleChange: (rowDocID: number, columnDocID: number, value: string) => void;
  handleBlur: (rowDocID: number, columnDocID: number, value: string) => void;
  title: string;
  config: IConfig;
  value?: IValue;
};

const TextFieldCell: React.FC<ITextFieldCellProps> = ({
  handleChange,
  handleBlur,
  rowDocID,
  columnDocID,
  title,
  value,
  config,
}) => {
  const textValue = value ? value.value : "";
  const isValid = value ? value.validationResult.isValid : true;
  const validationMessage = value ? value.validationResult.message : "";
  const { isMultiline } = config;
  return (
    <td css={textFieldCellCss}>
      <div css={titleTextFieldCellCss}>{title}</div>
      <TextField
        InputProps={{
          disableUnderline: true,
          endAdornment: !isValid && (
            <InputAdornment position="end">
              <Tooltip title={validationMessage}>
                <IconButton>
                  <ErrorIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        hiddenLabel
        fullWidth
        multiline={isMultiline}
        color="primary"
        variant="filled"
        css={borderColorCss(!isValid)}
        value={textValue}
        onChange={(e) => {
          handleChange(rowDocID, columnDocID, e.target.value);
        }}
        onBlur={(e) => {
          handleBlur(rowDocID, columnDocID, e.target.value);
        }}
      />
    </td>
  );
};

export default TextFieldCell;
