import { AxiosError } from "axios";
import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { IData } from "../../types";
import { fakeData } from "../../utils/fakeData";
import { fethData } from "../api";
import { setNewData } from "../redux/actions";

export type IFetchResult = {
  data: IData;
};

function* fetchSurveyData() {
  // const params = new URLSearchParams(document.location.search);
  // const surveyID = params.get("surveyID");
  // const paramsObj: { [key: string]: any } = {};
  //
  // for (const [key, value] of params) {
  // 	paramsObj[String(key)] = value;
  // }

  try {
    // const result: IFetchResult = yield call(() => fethData());
    // yield put(setNewData(result.data));

    yield put(setNewData(fakeData));
  } catch (e) {
    const error = e as AxiosError;
    // yield put(setError({ error: { status: true, message: error.message } }));
  }
}

function* mySaga() {
  yield takeEvery("FETCH_SURVEY_DATA", fetchSurveyData);
  // yield takeEvery("SEND_SURVEY_DATA", sendSurveyData);
}

export default mySaga;
