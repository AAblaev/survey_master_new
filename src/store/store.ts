import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
  Reducer,
} from "redux";
import createSagaMiddleware from "redux-saga";
import mySaga from "../services/middleware";
import { reducer } from "../services/redux/reducers";

// import { IParsedData } from "../utils/getInitState";
// import {
// 	IPageName,
// 	IParsedData,
// 	ISlideMoveDirection,
// } from "../duck/fakeData/surveyData"
// import { surveyReducer } from "../duck/reducers"
// import mySaga from "../services/middleware/saga"
//
// export type IState = {
//   loading: { [key: string]: boolean };
//   error: { [key: string]: boolean };
//   notifications: any;
//   session: any;
//   location: {
//     currentPage: IPageName,
//     currentSurveyCampaningIndex: number,
//     currentSectionIndex: number,
//     currentQuestionIndex: number,
//   }
//   styles:{
//     slideMoveDirection: ISlideMoveDirection,
//
//   }
//
//   data: IParsedData | null;
// };

const sagaMiddleware = createSagaMiddleware();
//
export const store = createStore(reducer, applyMiddleware(sagaMiddleware));
//
sagaMiddleware.run(mySaga);
