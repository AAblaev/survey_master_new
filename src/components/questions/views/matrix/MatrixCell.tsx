import React, { useEffect, useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ErrorIcon from "@material-ui/icons/Error";
import { ISimpleType, IValue } from "../../../../types";
import GreenRadio from "../../../common/GreenRadio";
import {
  borderColorMatrixCss,
  gridTextFieldCellCss,
  tdCss,
  titleTextFieldCellCss,
} from "./sc";
import { borderColorCss } from "../free-list";

type IMatixCellProps = {
  rowDocID: number; // dimension0
  columnDocID: number; // dimension1
  value?: IValue;

  handleBlur: (rowDocID: number, columnDocID: number, value: string) => void;
  handleClick: (rowDocID: number, columnDocID: number) => void;
  title: string;
  isMultiline: boolean;
  simpleType: ISimpleType;
};

type ITextFieldCellProps = {
  rowDocID: number;
  columnDocID: number;
  handleBlur: (rowDocID: number, columnDocID: number, value: string) => void;
  title: string;
  isMultiline: boolean;
  value?: IValue;
};

type IBoolCellProps = {
  isChecked: boolean;
  rowDocID: number;
  columnDocID: number;
  handleClick: (rowDocID: number, columnDocID: number) => void;
  title: string;
};

const MatrixCell: React.FC<IMatixCellProps> = ({
  handleClick,
  handleBlur,
  rowDocID,
  columnDocID,
  title,
  value,
  isMultiline,
  simpleType,
}) => {
  if (simpleType === "boolean") {
    const isChecked = Boolean(value) && value?.value === "1";
    return (
      <BoolCell
        rowDocID={rowDocID}
        columnDocID={columnDocID}
        handleClick={handleClick}
        title={title}
        isChecked={isChecked}
      />
    );
  }

  return (
    <TextFieldCell
      rowDocID={rowDocID}
      columnDocID={columnDocID}
      isMultiline={isMultiline}
      title={title}
      handleBlur={handleBlur}
      value={value}
    />
  );
};

const BoolCell: React.FC<IBoolCellProps> = ({
  isChecked,
  handleClick,
  rowDocID,
  columnDocID,
  title,
}) => {
  return (
    <div
      css={tdCss(isChecked, title)}
      onClick={() => handleClick(rowDocID, columnDocID)}
    >
      <GreenRadio checked={isChecked} />
    </div>
  );
};

const TextFieldCell: React.FC<ITextFieldCellProps> = ({
  handleBlur,
  rowDocID,
  columnDocID,
  title,
  value,
  isMultiline,
}) => {
  const storeTextValue = value ? value.value : "";
  const [textValue, setTextValue] = useState(storeTextValue);
  const isValid = value ? value.validationResult.isValid : true;
  const validationMessage = value ? value.validationResult.message : "";

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
        css={borderColorMatrixCss(!isValid)}
        value={textValue}
        onChange={(e) => {
          setTextValue(e.target.value);
        }}
        onBlur={(e) => {
          handleBlur(rowDocID, columnDocID, e.target.value);
        }}
      />
    </div>
  );
};

export default MatrixCell;
