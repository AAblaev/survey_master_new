import React from "react";
import { IAnswer, IOption, IQuestion } from "../../../types";
import { css } from "@emotion/react";
import GreenRadio from "../../common/GreenRadio";

export const thRowCss = css`
  text-align: left;
  font-weight: normal;
  border: 1px solid black;
  font-size: 1.3em;
  min-width: 350px;
  width: 30%;
  padding: 10px 20px;
`;

export const thColumnCss = css`
  font-size: 1.3em;
`;

export const tdCss = css`
  font-weight: normal;
  border: 1px solid black;
  text-align: center;
  // & > .MuiButtonBase-root {
  //   display: none;
  // }
  // &::after {
  //   content: "1";
  // }
`;

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

  const trCss = css`
    display: table-row;
    display: flex;
    flex-direction: column;
  `;

  const theadCss = css`
    display: none;
  `;

  return (
    <table>
      <thead>
        <tr>
          <th key="empty"></th>
          {columns.map((ch: IOption, index) => (
            <th key={index} css={thColumnCss}>
              {ch.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((rh, rhIndex) => (
          <tr key={rhIndex}>
            <th css={thRowCss}>{rh.title}</th>
            {columns.map((option, chIndex) => (
              <td
                css={tdCss}
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
  );
};

export default MatrixView;
