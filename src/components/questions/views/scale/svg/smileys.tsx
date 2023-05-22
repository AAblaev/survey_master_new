import { ReactComponent as Smiley1 } from "./smiley-1.svg";
import { ReactComponent as Smiley2 } from "./smiley-2.svg";
import { ReactComponent as Smiley3 } from "./smiley-3.svg";
import { ReactComponent as Smiley4 } from "./smiley-4.svg";
import { ReactComponent as Smiley5 } from "./smiley-5.svg";
import { ReactComponent as Smiley6 } from "./smiley-6.svg";
import { ReactComponent as Smiley7 } from "./smiley-7.svg";
import { ReactComponent as Smiley8 } from "./smiley-8.svg";
import { ReactComponent as Smiley9 } from "./smiley-9.svg";
import { ReactComponent as Smiley10 } from "./smiley-10.svg";

const smileys = [
  <Smiley1 />,
  <Smiley2 />,
  <Smiley3 />,
  <Smiley4 />,
  <Smiley5 />,
  <Smiley6 />,
  <Smiley7 />,
  <Smiley8 />,
  <Smiley9 />,
  <Smiley10 />,
];

export const getSmileys = (count: number) => {
  switch (count) {
    case 0:
      return [];
    case 1:
      return [smileys[9]];
    case 2:
      return [smileys[0], smileys[9]];
    case 3:
      return [smileys[0], smileys[5], smileys[9]];
    case 4:
      return [smileys[0], smileys[3], smileys[7], smileys[9]];
    case 5:
      return [smileys[0], smileys[2], smileys[5], smileys[8], smileys[9]];
    case 6:
      return [
        smileys[0],
        smileys[2],
        smileys[4],
        smileys[6],
        smileys[8],
        smileys[9],
      ];
    case 7:
      return [
        smileys[0],
        smileys[2],
        smileys[4],
        smileys[5],
        smileys[6],
        smileys[8],
        smileys[9],
      ];
    case 8:
      return [
        smileys[0],
        smileys[2],
        smileys[3],
        smileys[4],
        smileys[6],
        smileys[7],
        smileys[8],
        smileys[9],
      ];
    case 9:
      return [
        smileys[0],
        smileys[2],
        smileys[3],
        smileys[4],
        smileys[5],
        smileys[6],
        smileys[7],
        smileys[8],
        smileys[9],
      ];
    case 10:
      return smileys;
    default:
      const additionalItems = Array(count - smileys.length).fill(smileys[9]);
      return [...smileys, ...additionalItems];
  }
};
