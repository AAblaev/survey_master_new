import { delay, put, select } from "redux-saga/effects";
import { setAnswer } from "../redux/actions";
import { selectAnswers } from "../redux/selectors";
import { IValue } from "../../types";
import { SAGA_DELETE_FILES, SAGA_UPLOAD_FILES } from "../redux/types";
import {
  creacteNewValues,
  createUploadingValues,
  removeObjectAtIndex,
} from "./utils";

export function* onFilesUploaded(payload: {
  files: FileList;
  questionID: number;
  type: typeof SAGA_UPLOAD_FILES;
}) {
  const { files, questionID } = payload;
  const { userAnswers } = yield select(selectAnswers);

  const values = createUploadingValues(files);
  const prewValues = userAnswers[String(questionID)]
    ? userAnswers[String(questionID)].values
    : [];
  const newValues = creacteNewValues(prewValues, values);

  // установить loading
  yield put(setAnswer({ questionID, values: newValues }));
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

  // отправка данных
  yield delay(1000);

  yield put(
    setAnswer({
      questionID,
      values: newValues,
    })
  );
}
