import { ILocation } from "../types";

const getPrevAndNextLocation = (location: ILocation) => {
  if (location.title === "campaning") {
    return [
      {
        pageIndex: 0,
        pathName: "",
        questionIndex: 0,
        title: "campaning",
      },
      {
        pageIndex: 0,
        pathName: "",
        questionIndex: 0,
        title: "page",
      },
    ];
  }

  if (location.pageIndex === 0) {
    return [
      {
        pageIndex: 0,
        pathName: "",
        questionIndex: 0,
        title: "campaning",
      },
      {
        pageIndex: 1,
        pathName: "",
        questionIndex: 0,
        title: "page",
      },
    ];
  }

  return [
    {
      pageIndex: location.pageIndex - 1,
      pathName: "",
      questionIndex: 0,
      title: "page",
    },
    {
      pageIndex: location.pageIndex + 1,
      pathName: "",
      questionIndex: 0,
      title: "page",
    },
  ];
};

export default getPrevAndNextLocation;
