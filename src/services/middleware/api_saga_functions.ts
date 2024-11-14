import { AxiosError } from "axios";
import { call, put, select } from "redux-saga/effects";
import { IBackendAnswer, IData } from "../../types";
import { userAnswerParses } from "../../utils/userAnswerParser";
import { complete, fethData, sendData } from "../api";
import { PATH_NAME } from "../api/const";
import {
	changeCurretLocation,
	continuePrevSurvey,
	setDataAndParams,
	setError,
	setLoading,
	startNewSurvey,
	toggleTimer,
} from "../redux/actions";
import {
	selectAnswers,
	selectChangePageProps,
	selectCompleteSurveyProps,
	selectSurveyID,
	selectUid,
} from "../redux/selectors";
import {
	COMPLETE_SURVEY,
	FETCH_SURVEY_DATA,
	START_SURVEY,
} from "../redux/types";
import { getParams } from "./utils";

export type IFetchResult = {
	data: IData;
	answers: IBackendAnswer[];
	[key: string]: unknown;
};

export type IStartResult = {
	data: string;
	[key: string]: unknown;
};

export type IStoredData = {
	uid: string;
	surveyID: string;
};

export function* fetchSurveyData({
	correctUid = true,
}: {
	type: typeof FETCH_SURVEY_DATA;
	correctUid?: boolean;
}) {
	const { fetchPath, path, uid, surveyID, notTheFirstTime } = getParams({
		correctUid: correctUid,
	});
	const params = {
		surveyID,
		uid,
		path,
	};

	// console.log("fetchPath", fetchPath);
	// const fakeFetchPath = "http://192.168.0.133:5002/api/survey/bylink/tripl";
	try {
		yield put(setLoading(true));
		const result: IFetchResult = yield call(() => fethData(fetchPath));
		const data = result.data;
		yield put(
			setDataAndParams({
				data,
				params,
				notTheFirstTime: notTheFirstTime && correctUid,
			})
		);
		const { isShowGreetingsPage } = data;
		const needEmediatlyStartSurvey = !isShowGreetingsPage && !notTheFirstTime;

		yield put(setLoading(false));
		if (needEmediatlyStartSurvey) {
			// console.log("needEmediatlyStartSurvey");
			// console.log("correctUid", correctUid);

			yield put({ type: START_SURVEY, isContinue: false });
		}
	} catch (e) {
		const error = e as AxiosError<{ name: string; noReplayMessage: string }>;
		const message = error?.response?.data?.noReplayMessage
			? error.response.data.noReplayMessage
			: "";
		yield put(setLoading(false));
		yield put(setError({ status: true, message: message }));
	}
}

export function* startSurvey({
	isContinue,
}: {
	type: typeof START_SURVEY;
	isContinue: boolean;
}) {
	const { surveyID } = yield select(selectSurveyID);
	if (isContinue) {
		yield put(continuePrevSurvey());
		return;
	}

	const isNewAPI = Number.isNaN(Number(surveyID));

	const path = isNewAPI
		? `${PATH_NAME}start2/${surveyID}`
		: `${PATH_NAME}start/${surveyID}`;

	try {
		yield put(setLoading(true));
		const result: IStartResult = yield call(() => fethData(path));
		const newUid = result.data;
		yield put(startNewSurvey(newUid));
		localStorage.setItem(
			"surveyParams",
			JSON.stringify({ uid: newUid, surveyID: surveyID })
		);
		yield put(toggleTimer(true));
		yield put(setLoading(false));
		// console.log("startSurvey success", result);
	} catch (e) {
		const error = e as AxiosError<{ name: string; noReplayMessage: string }>;
		const message = error?.response?.data?.noReplayMessage
			? error.response.data.noReplayMessage
			: "";
		yield put(setLoading(false));
		yield put(setError({ status: true, message: message }));
	}
}

export function* sendSurveyData() {
	const { uid } = yield select(selectUid);
	const { userAnswers } = yield select(selectAnswers);
	const answers = userAnswerParses(userAnswers);
	const path = PATH_NAME + "answers/?uid=" + uid;

	try {
		yield put(setLoading(true));
		yield call(() => sendData(path, answers));
		yield put(setLoading(false));
		// console.log("sendSurveyData success", result);
	} catch (e) {
		const error = e as AxiosError<{ name: string }>;
		const message = error?.response?.data?.name
			? error.response.data.name
			: error.message;
		yield put(setLoading(false));
		yield put(setError({ status: true, message: message }));
	}
}

export function* sagaSendData() {
	// console.log("sagaSendData");
	const { uid, userAnswers } = yield select(selectChangePageProps);

	const answers = userAnswerParses(userAnswers);
	const path = PATH_NAME + "answers/?uid=" + uid;
	try {
		yield put(setLoading(true));
		yield call(() => sendData(path, answers));
		yield put(setLoading(false));
		// console.log("sendSurveyData success", result);
	} catch (e) {
		const error = e as AxiosError<{ name: string }>;
		const message = error?.response?.data?.name
			? error.response.data.name
			: error.message;
		yield put(setLoading(false));
		yield put(setError({ status: true, message: message }));
	}
}

export function* imediateCompletion(byTimer?: boolean) {
	// console.log("imediateCompletion");
	const { uid, userAnswers, location } = yield select(
		selectCompleteSurveyProps
	);

	const answers = userAnswerParses(userAnswers);
	const pathSendData = PATH_NAME + "answers/?uid=" + uid;
	const by_timer_path = byTimer ? "?btm=1" : "";
	const pathComplete = PATH_NAME + "complete/" + uid + by_timer_path;

	try {
		yield put(setLoading(true));
		yield call(() => sendData(pathSendData, answers));
		yield call(() => complete(pathComplete, {}));
		yield put(
			changeCurretLocation({
				location: {
					pathName: byTimer ? "completion_by_timer" : "completion",
					title: byTimer ? "completion_by_timer" : "completion",
					questionIndex: 0,
					pageIndex: location.pageIndex,
				},
				slideMoveDirection: "right-to-left",
			})
		);
		// clear localStorage
		localStorage.clear();
		yield put(setLoading(false));
	} catch (e) {
		const error = e as AxiosError<{ name: string }>;
		const message = error?.response?.data?.name
			? error.response.data.name
			: error.message;
		yield put(setLoading(false));
		yield put(setError({ status: true, message: message }));
	}
}

export function* imediateDisqualification() {
	const { uid, userAnswers, location } = yield select(
		selectCompleteSurveyProps
	);

	const answers = userAnswerParses(userAnswers);
	const pathSendData = PATH_NAME + "answers/?uid=" + uid;
	const pathComplete = PATH_NAME + "complete/" + uid;

	try {
		yield put(setLoading(true));
		yield call(() => sendData(pathSendData, answers));
		yield call(() => complete(pathComplete, {}));
		yield put(
			changeCurretLocation({
				location: {
					pathName: "disqualification",
					title: "disqualification",
					questionIndex: 0,
					pageIndex: location.pageIndex,
				},
				slideMoveDirection: "right-to-left",
			})
		);
		localStorage.clear();

		yield put(setLoading(false));
	} catch (err) {
		console.log("error", err);
	}
}
