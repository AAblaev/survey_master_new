import { ICheckingConfig, ISlideMoveDirection } from "../types";

type getCheckingConfig = (
  direction: ISlideMoveDirection,
  strictModeNavigation: boolean
) => ICheckingConfig;

const getCheckingConfig: getCheckingConfig = (
  direction,
  strictModeNavigation
) => {
  // console.log("getCheckingConfig");
  // console.log("direction", direction);
  // console.log("strictModeNavigation", strictModeNavigation);

  return {
    questionChecking: direction === "right-to-left" && strictModeNavigation,
    logicalChecking: direction === "right-to-left" && strictModeNavigation,
    disqualificationChecking: true,
    completeChecking: true,
    immediatelyComplete: direction === "right-to-left" && strictModeNavigation,
  };
};

export default getCheckingConfig;
