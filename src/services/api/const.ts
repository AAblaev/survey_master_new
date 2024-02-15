/// <reference path="../../../global.d.ts" />

export const PATH_NAME_FOR_DEV = "http://192.168.0.133:5002/api/survey/";
export const PATH_NAME_FOR_DEV_II = "http://192.168.0.133:5002/api/survey/";

// console.log("document.location.origin", document.location.origin);
// console.log("document.location.pathname", document.location.pathname);

export const PATH_NAME = __IS_PROD_BUNDLE_MODE__
  ? document.location.origin + "/api/survey/"
  : PATH_NAME_FOR_DEV;

export const PATH_NAME_II = __IS_PROD_BUNDLE_MODE__
  ? document.location.origin + "/api/survey/"
  : PATH_NAME_FOR_DEV_II;

export const DEFAULT_SURVEY_ID = "";

export const LINK_NAME = "link";
