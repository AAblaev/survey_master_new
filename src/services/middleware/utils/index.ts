import {
  DEFAULT_SURVEY_ID,
  getPathName,
  PATH_NAME,
  PATH_NAME_II,
} from "../../api/const";
import { IStoredData } from "../saga";

export const getParams = ({ correctUid }: { correctUid: boolean }) => {
  const params = new URLSearchParams(document.location.search);
  const surveyIDfromURL = params.get("surveyID");
  const uidFromURL = params.get("uid");

  const isNewAPI = Number.isNaN(Number(surveyIDfromURL));
  const surveyID = surveyIDfromURL ? surveyIDfromURL : DEFAULT_SURVEY_ID;

  const storedData = localStorage.getItem("surveyParams");
  const surveyParams: IStoredData | null = storedData && JSON.parse(storedData);
  const prevUid = surveyParams ? surveyParams.uid : "";
  const prevSurveyID = surveyParams ? surveyParams.surveyID : "";
  const isRetryingFetch = String(prevSurveyID) === String(surveyID);

  const fetchPath = getPathName({
    basePath: isNewAPI ? `${PATH_NAME_II}bylink/` : PATH_NAME,
    surveyIDfromURL,
    uidFromURL,
    prevSurveyID,
    prevUid,
    isNewAPI,
    correctUid: correctUid,
  });

  const uid = uidFromURL ? uidFromURL : isRetryingFetch ? prevUid : "";
  const path = PATH_NAME;
  const notTheFirstTime = Boolean(isRetryingFetch || uidFromURL);

  return {
    fetchPath,
    path,
    uid,
    surveyID,
    notTheFirstTime,
  };
};
