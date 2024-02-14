import { DEFAULT_SURVEY_ID, LINK_NAME } from "./const";

interface QueryParams {
  [key: string]: string;
}

export const getSurveyIDfromURL = (urlString: string): string => {
  const url = new URL(urlString);
  const pathParts = url.pathname.split("/");
  const survey2Index = pathParts.indexOf(LINK_NAME);
  const surveyIDFromPath = survey2Index ? pathParts[survey2Index + 1] : "";
  const queryParams: QueryParams = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  const surveyIDfromURL = surveyIDFromPath
    ? surveyIDFromPath
    : queryParams["surveyID"];
  return surveyIDfromURL;
};

type IGetPathName = (payload: {
  basePath: string;
  surveyIDfromURL: string | null;
  uidFromURL: string | null;
  prevSurveyID: string;
  prevUid: string;
  isNewAPI: boolean;
  correctUid: boolean;
}) => string;

export const getPathName: IGetPathName = ({
  basePath,
  surveyIDfromURL,
  uidFromURL,
  prevSurveyID,
  prevUid,
  isNewAPI,
  correctUid,
}) => {
  if (isNewAPI) {
    // console.log("isNewAPI");

    if (uidFromURL && correctUid) {
      // console.log("uidFromURL");
      return `${basePath}${surveyIDfromURL}?uid=${uidFromURL}`;
    }

    if (
      prevSurveyID &&
      prevUid &&
      String(surveyIDfromURL) === String(prevSurveyID) &&
      correctUid
    ) {
      return `${basePath}${surveyIDfromURL}?uid=${prevUid}`;
    }

    return `${basePath}${surveyIDfromURL}`;
  }

  // console.log("oldApi");

  if (!surveyIDfromURL) {
    return `${basePath}${DEFAULT_SURVEY_ID}`;
  }

  if (uidFromURL) {
    // console.log("uidFromURL");
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

export const getLinkForContinue = (surveyID: string, uid: string) => {
  const isNewAPI = document.location.pathname.split("/").includes(LINK_NAME);
  const result = isNewAPI
    ? document.location.origin + document.location.pathname + "/?uid=" + uid
    : document.location.origin + "/?surveyID=" + surveyID + "&uid=" + uid;

  return result;
};
