import React, { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ErrorIcon from "@material-ui/icons/Error";
import { IConfig, IValue } from "../../../../types";
import { borderColorCss } from "../free-list";
import {
  gridTextFieldCellCss,
  textFieldCellCss,
  titleTextFieldCellCss,
} from "./sc";

type ITextFieldCellProps = {
  rowDocID: number;
  columnDocID: number;
  handleChange: (rowDocID: number, columnDocID: number, value: string) => void;
  handleBlur: (rowDocID: number, columnDocID: number, value: string) => void;
  title: string;
  config: IConfig;
  value?: IValue;
};

const GridTextFieldCell: React.FC<ITextFieldCellProps> = ({
  handleBlur,
  rowDocID,
  columnDocID,
  title,
  value,
  config,
}) => {
  // console.log("render", value);
  const storeTextValue = value ? value.value : "";
  const [textValue, setTextValue] = useState(storeTextValue);

  // const textValue = value ? value.value : "";
  const isValid = value ? value.validationResult.isValid : true;
  const validationMessage = value ? value.validationResult.message : "";
  const { isMultiline } = config;

  useEffect(() => {
    setTextValue(storeTextValue);
  }, [storeTextValue]);
  return (
    <div css={gridTextFieldCellCss}>
      <div css={titleTextFieldCellCss}>{title}</div>
      <TextField
        InputProps={{
          style: { height: "100%" },
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
        maxRows={4}
        color="primary"
        variant="filled"
        css={borderColorCss(!isValid)}
        value={textValue}
        onChange={(e) => {
          // handleChange(rowDocID, columnDocID, e.target.value);
          setTextValue(e.target.value);
        }}
        onBlur={(e) => {
          handleBlur(rowDocID, columnDocID, e.target.value);
        }}
      />
    </div>
  );
};

export default GridTextFieldCell;
