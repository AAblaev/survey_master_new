import { IValue } from "../../../types";
import { DEFAULT_SURVEY_ID, PATH_NAME, PATH_NAME_II } from "../../api/const";
import { getPathName, getSurveyIDfromURL } from "../../api/utils";
import { IStoredData } from "../api_saga_functions";

export const getParams = ({ correctUid }: { correctUid: boolean }) => {
  const params = new URLSearchParams(document.location.search);
  const surveyIDfromURL = getSurveyIDfromURL(document.location.href);
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

export const createUploadingValues = (files: FileList): IValue[] => {
  return Object.values(files).map((file) => {
    return {
      optionID: hashCode(file.name),
      value: file.name,
      fileProps: {
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,
        loading: true,
      },
      validationResult: { isValid: true, message: "" },
      isFocused: false,
    };
  });
};

const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

export const creacteNewValues = (
  prewValues: IValue[],
  values: IValue[]
): IValue[] => {
  const result = [...prewValues];

  values.forEach((value) => {
    const existingIndex = result.findIndex(
      (prewValue) => prewValue.fileProps!.name === value.fileProps!.name
    );
    if (existingIndex !== -1) {
      result[existingIndex] = value;
    } else {
      result.push(value);
    }
  });

  return result;
};

export const removeObjectAtIndex = <T>(array: T[], index: number): T[] => {
  if (index < 0 || index >= array.length) {
    throw new Error("Index out of bounds");
  }
  const newArray = [...array.slice(0, index), ...array.slice(index + 1)];
  return newArray;
};
