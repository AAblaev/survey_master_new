import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import MatrixCell from "./MatrixCell";
import { IAnswer, IQuestion, ISimpleType, IValue } from "../../../../types";
import {
  tableHeaderCellCss,
  wrapperCss,
  new_tableCss,
  new_theadCss,
  new_headerRowCss,
  new_headerFirstColumnCellCss,
  tbodyCss,
  trCss,
  new_tableFirstColumnCellCss,
  new_tableCellCss,
} from "./sc";
import { validation } from "../../../../utils/validation";

type IMatrixViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
  validation: (question: IQuestion) => void;
};

type IValuesDict = { [key: string]: IValue };

const MatrixView: React.FC<IMatrixViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const {
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
    // isChooseManyInrow,
    // isChooseManyIncol,
    mobileTabularView = true,
  } = config;
  const isChooseManyInrow = true;
  const isChooseManyIncol = true;
  // const mobileTabularView = false;
  const simpleType = config.simpleType as ISimpleType;
  const showHoverEffect = simpleType === "boolean";
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const values = userAnswerExist ? userAnswer.values : [];
  // console.log("values", values);

  const valuesDict: IValuesDict = values.reduce((acc: IValuesDict, item) => {
    acc[`d0_${item.dimension0}_d1_${item.dimension1}`] = item;
    return acc;
  }, {});

  const columns = question.config.options!.filter(
    (option) => option.dimension === 1
  );
  const rows = question.config.options!.filter(
    (option) => option.dimension === 0
  );

  const handleClick = (rowDocID: number, columnDocID: number) => {
    const newV: IValue[] = [];
    values.forEach((v) => {
      if (
        Number(v.dimension0) === rowDocID &&
        Number(v.dimension1) === columnDocID
      ) {
        return;
      }

      if (!isChooseManyInrow && rowDocID === Number(v.dimension0)) {
        return;
      }
      if (!isChooseManyIncol && columnDocID === Number(v.dimension1)) {
        return;
      }
      newV.push(v);
    });

    const isAlreadyChecked = Boolean(
      valuesDict[`d0_${rowDocID}_d1_${columnDocID}`]
    );
    if (isAlreadyChecked) {
      setAnswer({
        questionID: docID,
        values: [...newV],
      });
      return;
    }

    setAnswer({
      questionID: docID,
      values: [
        ...newV,
        {
          optionID: 0,
          value: String(1),
          validationResult: { isValid: true, message: "success" },
          dimension0: String(rowDocID),
          dimension1: String(columnDocID),
          isFocused: false,
        },
      ],
    });
  };

  const handleBlur = (rowDocID: number, columnDocID: number, value: string) => {
    const newValues = values.filter(
      (value) =>
        !(
          Number(value.dimension0) === rowDocID &&
          Number(value.dimension1) === columnDocID
        )
    );

    if (value.trim() === "") {
      setAnswer({
        questionID: docID,
        values: [...newValues],
      });
      return;
    }

    const validationResult = validation({
      value,
      simpleType: simpleType ?? "string",
      isLimited,
      isLimitedValue,
      limit,
      limitValue,
    });
    setAnswer({
      questionID: docID,
      values: [
        ...newValues,
        {
          optionID: 0,
          dimension0: String(rowDocID),
          dimension1: String(columnDocID),
          value: value,
          validationResult: validationResult,
          isFocused: false,
        },
      ],
    });
  };

  return (
    <>
      <div>
        <PerfectScrollbar
          options={{ suppressScrollX: false, suppressScrollY: true }}
          css={wrapperCss}
        >
          <table css={new_tableCss(mobileTabularView)}>
            <thead css={new_theadCss(mobileTabularView)}>
              <tr css={new_headerRowCss}>
                <th css={new_headerFirstColumnCellCss(250)}></th>
                {columns.map((option) => (
                  <th css={tableHeaderCellCss} key={option.docID}>
                    {option.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody css={tbodyCss(mobileTabularView)}>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  css={trCss(mobileTabularView, showHoverEffect)}
                >
                  <th css={new_tableFirstColumnCellCss}>{row.title}</th>

                  {columns.map((col, colIndex) => (
                    <td
                      key={col.docID}
                      css={new_tableCellCss(mobileTabularView, showHoverEffect)}
                    >
                      <MatrixCell
                        key={rowIndex + "td" + colIndex}
                        title={col.title}
                        simpleType={simpleType}
                        mobileTabularView={mobileTabularView}
                        rowDocID={row.docID}
                        columnDocID={col.docID}
                        value={valuesDict[`d0_${row.docID}_d1_${col.docID}`]}
                        isMultiline={config.isMultiline}
                        handleClick={handleClick}
                        handleBlur={handleBlur}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </PerfectScrollbar>
      </div>
    </>
  );
};

export default MatrixView;
