import { ILocation } from "../types";

const getPrevAndNextLocation = (location: ILocation): ILocation[] => {
  if (location.pageIndex === 0) {
    return [
      {
        pageIndex: 0,
        pathName: "survey",
        questionIndex: 0,
        title: "campaning",
      },
      {
        pageIndex: 1,
        pathName: "section",
        questionIndex: 0,
        title: "page",
      },
    ];
  }

  return [
    {
      pageIndex: location.pageIndex - 1,
      pathName: "section",
      questionIndex: 0,
      title: "page",
    },
    {
      pageIndex: location.pageIndex + 1,
      pathName: "section",
      questionIndex: 0,
      title: "page",
    },
  ];
};

export default getPrevAndNextLocation;
