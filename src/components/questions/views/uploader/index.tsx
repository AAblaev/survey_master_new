import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { PRIMARY_COLOR } from "../../../../consts/const";
import {
  btnCss,
  ddAreaCss,
  listItemCss,
  listItemEndIconCss,
  listItemStartIconCss,
  visuallyHiddenInputCss,
} from "./sc";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import { IViewComponentProps } from "../..";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NoteIcon from "@mui/icons-material/Note";
import CloseIcon from "@mui/icons-material/Close";
import {
  SAGA_DELETE_FILES,
  SAGA_UPLOAD_FILES,
} from "../../../../services/redux/types";
import IconButton from "@mui/material/IconButton";

const FileUploader: React.FC<IViewComponentProps> = ({
  question,
  questionStyles,
  userAnswer,
}) => {
  const [isOverArea, setOverArea] = useState<boolean>(false);
  const dispatch = useDispatch();

  const values = userAnswer ? userAnswer.values : [];
  const loading = values.some((v) => v.fileProps!.loading);
  const areaBorderColor = questionStyles.counter.font.color;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOverArea(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOverArea(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
    setOverArea(false);
  };

  const handleUpload = (files: FileList) => {
    dispatch({
      type: SAGA_UPLOAD_FILES,
      questionID: question.docID,
      files: files,
    });
  };

  const handleDelete = (index: number) => {
    dispatch({
      type: SAGA_DELETE_FILES,
      index: index,
      questionID: question.docID,
    });
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        css={ddAreaCss(areaBorderColor, isOverArea)}
      >
        {loading ? (
          <div>Загрузка</div>
        ) : (
          <div>Перетащите файлы или выберите на компьютере</div>
        )}

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          disabled={loading}
          startIcon={<CloudUploadIcon />}
        >
          Выбрать файл
          <input
            type="file"
            multiple
            css={visuallyHiddenInputCss}
            onChange={handleFileChange}
          />
        </Button>
      </div>
      {values.filter((v) => !v.fileProps?.loading).length > 0 && (
        <List>
          {values
            .filter((v) => !v.fileProps?.loading)
            .map((v, i) => (
              <ListItem key={v.optionID} css={listItemCss}>
                <ListItemIcon css={listItemStartIconCss} color="primary">
                  <NoteIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={v.value} />

                <IconButton
                  aria-label="delete"
                  size="small"
                  color="primary"
                  disabled={loading}
                  onClick={() => handleDelete(i)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </ListItem>
            ))}
        </List>
      )}
    </>
  );
};

export default FileUploader;
