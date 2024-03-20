import { delay, put, select } from "redux-saga/effects";
import { setAnswer } from "../redux/actions";
import { selectAnswers } from "../redux/selectors";
import { IValue } from "../../types";
import { SAGA_DELETE_FILES, SAGA_UPLOAD_FILES } from "../redux/types";
import {
  creacteNewValues,
  createUploadingValues,
  megabytesToBytes,
  removeObjectAtIndex,
} from "./utils";

export function* onFilesUploaded(payload: {
  files: FileList;
  questionID: number;
  filesCount: number;
  fileSizeLimit: number;
  type: typeof SAGA_UPLOAD_FILES;
}) {
  const { files, questionID, filesCount, fileSizeLimit } = payload;
  const { userAnswers } = yield select(selectAnswers);

  const values = createUploadingValues(files);
  const prewValues = userAnswers[String(questionID)]
    ? userAnswers[String(questionID)].values
    : [];
  const newValues = creacteNewValues(prewValues, values);
  // проверка на количество и размер

  if (newValues.length > filesCount) {
    yield put(
      setAnswer({
        questionID,
        values: prewValues,
        alert: {
          showAlert: true,
          alertMessage: "Превышено допустимое количество файлов ",
          status: "error",
        },
      })
    );
    return;
  }

  const filesSize = newValues.reduce((acc, v) => (acc += v.fileProps!.size), 0);

  if (filesSize > megabytesToBytes(fileSizeLimit)) {
    yield put(
      setAnswer({
        questionID,
        values: prewValues,
        alert: {
          showAlert: true,
          alertMessage: "Превышен допустимый размер файлов ",
          status: "error",
        },
      })
    );
    return;
  }

  // установить loading
  yield put(
    setAnswer({
      questionID,
      values: newValues,
      alert: { showAlert: false, alertMessage: "", status: "success" },
    })
  );
  // отправка данных
  yield delay(1000);
  // установить loading в false при успехе

  yield put(
    setAnswer({
      questionID,
      values: newValues.map((v) => ({
        ...v,
        fileProps: { ...v.fileProps!, loading: false },
      })),
      alert: {
        showAlert: true,
        alertMessage: "Файлы загружены",
        status: "success",
      },
    })
  );
}

export function* onFilesDeleted(payload: {
  index: number;
  questionID: number;
  type: typeof SAGA_DELETE_FILES;
}) {
  const { index, questionID } = payload;
  const { userAnswers } = yield select(selectAnswers);

  const prewValues: IValue[] = userAnswers[String(questionID)]
    ? userAnswers[String(questionID)].values
    : [];

  const newValues = removeObjectAtIndex(prewValues, index);

  yield put(
    setAnswer({
      questionID,
      values: prewValues,
      alert: {
        showAlert: false,
        alertMessage: "Файл удалён",
        status: "success",
      },
    })
  );
  // отправка данных
  yield delay(1000);

  yield put(
    setAnswer({
      questionID,
      values: newValues,
      alert: {
        showAlert: true,
        alertMessage: "Файл удалён",
        status: "success",
      },
    })
  );
}
