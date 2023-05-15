import axios from "axios";

// const headers = {
// 	Accept:
// 		"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
// 	"Accept-Encoding": "gzip, deflate",
// 	"Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
// };

export const fethData = (path: string) => {
  return axios(path, {
    // headers: headers,
  });
};

export const sendData = (path: string, data: any[]) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios.post(path, data, config);
};

// export const fethData = () => {
//   const params = new URLSearchParams(document.location.search);
//   const surveyID = params.get("surveyID");
//   // const paramsObj: { [key: string]: any } = {};
//   // console.log("params", params);
//   // console.log("surveyID", surveyID);
//
//   return axios(PATH_NAME + surveyID, {
//     // headers: headers,
//   });
// };

// export const sendData = ({
// 	data,
// 	params,
// }: {
// 	data: IData;
// 	params: IParams;
// }) => {
// 	const config = {
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	};
// 	return axios.post(
// 		`http://95.163.85.171:27802/WebSurvey/api/sa/SurveyService/completeSurvey`,
// 		{ ...data, params: params },
// 		config
// 	);
// };
