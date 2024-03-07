import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { ISimpleType, IValue } from "../../../../types";
import GreenRadio from "../../../common/GreenRadio";
import {
  borderColorMatrixCss,
  gridTextFieldCellCss,
  tdCss,
  titleTextFieldCellCss,
} from "./sc";
import { REGEXP_DICT } from "../../../../utils/validation";

type IMatixCellProps = {
  rowDocID: number; // dimension0
  columnDocID: number; // dimension1
  value?: IValue;
  handleBlur: (rowDocID: number, columnDocID: number, value: string) => void;
  handleClick: (rowDocID: number, columnDocID: number) => void;
  title: string;
  isMultiline: boolean;
  simpleType: ISimpleType;
  mobileTabularView: boolean;
};

type ITextFieldCellProps = {
  rowDocID: number;
  columnDocID: number;
  handleBlur: (rowDocID: number, columnDocID: number, value: string) => void;
  title: string;
  isMultiline: boolean;
  value?: IValue;
  mobileTabularView: boolean;
  simpleType: ISimpleType;
};

type IBoolCellProps = {
  isChecked: boolean;
  rowDocID: number;
  columnDocID: number;
  handleClick: (rowDocID: number, columnDocID: number) => void;
  title: string;
  mobileTabularView: boolean;
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
  mobileTabularView,
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
        mobileTabularView={mobileTabularView}
      />
    );
  }

  return (
    <TextFieldCell
      simpleType={simpleType}
      rowDocID={rowDocID}
      columnDocID={columnDocID}
      isMultiline={isMultiline}
      title={title}
      handleBlur={handleBlur}
      value={value}
      mobileTabularView={mobileTabularView}
    />
  );
};

const BoolCell: React.FC<IBoolCellProps> = ({
  isChecked,
  handleClick,
  rowDocID,
  columnDocID,
  title,
  mobileTabularView,
}) => {
  return (
    <div
      css={tdCss(mobileTabularView, isChecked, title)}
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
  mobileTabularView,
  simpleType,
}) => {
  const inputRef = useRef(null);

  const storeTextValue = value ? value.value : "";
  const [textValue, setTextValue] = useState(storeTextValue);
  const isValid = value ? value.validationResult.isValid : true;
  const validationMessage = value ? value.validationResult.message : "";

  useEffect(() => {
    setTextValue(storeTextValue);
  }, [storeTextValue]);
  return (
    <div css={gridTextFieldCellCss}>
      <div css={titleTextFieldCellCss(mobileTabularView)}>{title}</div>
      <Tooltip title={!isValid ? validationMessage : ""}>
        <TextField
          InputProps={{
            style: { height: "100%" },
            disableUnderline: true,
            type:
              simpleType === "integer" || simpleType === "float"
                ? "number"
                : "text",
            onWheel: (e) => {
              inputRef.current && (inputRef.current as any).blur();
            },
          }}
          hiddenLabel
          fullWidth
          multiline={isMultiline}
          maxRows={4}
          color="primary"
          variant="filled"
          css={borderColorMatrixCss(!isValid)}
          value={textValue}
          inputRef={inputRef}
          onChange={(e) => {
            const value = e.target.value;
            if (
              (simpleType === "integer" || simpleType === "float") &&
              !REGEXP_DICT["float"].test(value)
            ) {
              return;
            }
            setTextValue(value);
          }}
          onBlur={(e) => {
            handleBlur(rowDocID, columnDocID, e.target.value);
          }}
        />
      </Tooltip>
    </div>
  );
};

export default MatrixCell;
