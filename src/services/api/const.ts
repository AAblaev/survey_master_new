/// <reference path="../../../global.d.ts" />

export const PATH_NAME_FOR_DEV = "http://192.168.0.133:5004/api/survey/";

export const PATH_NAME = __IS_PROD_BUNDLE_MODE__
  ? document.location.origin + document.location.pathname
  : PATH_NAME_FOR_DEV;

export const DEFAULT_SURVEY_ID = "1";

type IGetPathName = (payload: {
  basePath: string;
  surveyIDfromURL: string | null;
  uidFromURL: string | null;
  prevSurveyID: string;
  prevUid: string;
}) => string;

export const getPathName: IGetPathName = ({
  basePath,
  surveyIDfromURL,
  uidFromURL,
  prevSurveyID,
  prevUid,
}) => {
  if (!surveyIDfromURL) {
    return `${basePath}${DEFAULT_SURVEY_ID}`;
  }

  if (uidFromURL) {
    console.log("uidFromURL");
    return `${basePath}${surveyIDfromURL}?uid=${uidFromURL}`;
  }

  if (
    prevSurveyID &&
    prevUid &&
    String(surveyIDfromURL) === String(prevSurveyID)
  ) {
    return `${basePath}${surveyIDfromURL}?uid=${prevUid}`;
  }

  return `${basePath}${surveyIDfromURL}`;
};
