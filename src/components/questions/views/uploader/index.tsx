import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  areaTextCss,
  ddAreaCss,
  listItemCss,
  listItemStartIconCss,
  messageCss,
  messageWrapperCss,
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
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { IStatus } from "../../../../types";

const FileUploader: React.FC<IViewComponentProps> = ({
  question,
  questionStyles,
  userAnswer,
  setAnswer,
}) => {
  const [isOverArea, setOverArea] = useState<boolean>(false);
  const [showAlert, setAlert] = useState<boolean>(false);
  const dispatch = useDispatch();
  const {
    docID,
    config: { filesCount, fileSizeLimit },
  } = question;

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
      questionID: docID,
      files: files,
      filesCount: filesCount,
      fileSizeLimit: fileSizeLimit,
    });
  };

  const handleDelete = (index: number) => {
    dispatch({
      type: SAGA_DELETE_FILES,
      index: index,
      questionID: docID,
    });
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);

    const alert = Boolean(userAnswer?.alert)
      ? { ...userAnswer.alert!, showAlert: false }
      : { showAlert: false, alertMessage: "", status: "success" as IStatus };
    setAnswer({
      ...userAnswer,
      alert: alert,
    });
  };

  useEffect(() => {
    if (userAnswer?.alert?.showAlert) {
      setAlert(true);
    }
  }, [userAnswer?.alert?.showAlert]);

  return (
    <>
      <Snackbar open={showAlert} autoHideDuration={1500} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={userAnswer?.alert?.status}
          variant="outlined"
          sx={{ width: "100%" }}
        >
          {userAnswer?.alert?.alertMessage}
        </Alert>
      </Snackbar>
      <div css={messageWrapperCss}>
        <div css={messageCss}>
          {fileSizeLimit && (
            <span> {`Максимальный размер файла: ${fileSizeLimit} МБ. `}</span>
          )}
          {filesCount && (
            <span> {`Загрузить можно не более ${filesCount} файлов. `}</span>
          )}
          <Tooltip
            title={
              "jpeg, jpg, png, gif, bmp, ico, avi, mp4, 3gp, mkv, flv, mov, mpg, mp3, wav, pdf, doc, docx, xls, xlsx, csv, txt, ppt, pptx, odt, odx, rtf, zip, rar, gz, tar.gz, tar, 7z"
            }
          >
            <span style={{ color: "blue" }}>Разрешенные форматы файлов.</span>
          </Tooltip>
        </div>
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        css={ddAreaCss(areaBorderColor, isOverArea)}
      >
        {loading ? <div>Загрузка</div> : <div css={areaTextCss}></div>}
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
