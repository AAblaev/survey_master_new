import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import GreenRadio from "../../../common/GreenRadio";
import { IAnswer, IOption, IQuestion } from "../../../../types";
import {
  tableCss,
  tbodyCss,
  tdCss,
  thColumnCss,
  theadCss,
  thRowCss,
  trCss,
  wrapperCss,
} from "./sc";

type IMatrixViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
};

const MatrixView: React.FC<IMatrixViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID } = question;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const values = userAnswerExist ? userAnswer.values : [];

  type IValuesDict = { [key: number]: string };

  const valuesDict: IValuesDict = values.reduce((acc: IValuesDict, item) => {
    acc[item.optionID] = item.value;
    return acc;
  }, {});

  const columns = question.config.options!.filter(
    (option) => option.dimension === 1
  );
  const rows = question.config.options!.filter(
    (option) => option.dimension === 0
  );

  const handleClick = (rowDocID: number, columnDocID: number) => {
    const newValues = values.filter((value) => value.optionID !== rowDocID);
    setAnswer({
      questionID: docID,
      values: [
        ...newValues,
        { optionID: rowDocID, value: String(columnDocID) },
      ],
    });
  };

  return (
    <PerfectScrollbar
      option={{ suppressScrollX: false, suppressScrollY: true }}
      css={wrapperCss}
    >
      <table css={tableCss}>
        <thead css={theadCss}>
          <tr>
            <th key="empty"></th>
            {columns.map((ch: IOption, index) => (
              <th key={index} css={thColumnCss}>
                {ch.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody css={tbodyCss}>
          {rows.map((rh, rhIndex) => (
            <tr key={rhIndex} css={trCss}>
              <th css={thRowCss}>{rh.title}</th>
              {columns.map((option, chIndex) => (
                <td
                  css={tdCss(
                    valuesDict[rh.docID] === String(option.docID),
                    option.title
                  )}
                  key={rhIndex + "td" + chIndex}
                  onClick={() => handleClick(rh.docID, option.docID)}
                >
                  <GreenRadio
                    checked={valuesDict[rh.docID] === String(option.docID)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </PerfectScrollbar>
  );
};

export default MatrixView;
