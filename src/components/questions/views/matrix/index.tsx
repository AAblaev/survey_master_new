import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
} from "@material-ui/core";
import MatrixCell from "./MatrixCell";
import { IAnswer, IQuestion, ISimpleType, IValue } from "../../../../types";
import {
  cellCss,
  gridCss,
  headerCss,
  rowCss,
  wrapperCss,
  headerColumnCss,
  tableCellCss,
  tableHeaderColumnCss,
  onlyDesctopRender,
  onlyMobileRender,
  thRowMobileCss,
  tableCss,
  tableRowCss,
  tableHeaderCellCss,
  tableFirstColumnCellCss,
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

const useStyles = makeStyles({
  table: {
    maxWidth: "99%",
    minWidth: "700px",
    width: "auto",
  },
  firstColumn: {
    width: "25%",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "#f2f2f2",
    },
  },
});
const MatrixView: React.FC<IMatrixViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const classes = useStyles();
  const { docID, config } = question;
  const {
    isLimited,
    isLimitedValue,
    limit,
    limitValue,
    isChooseManyInrow,
    isChooseManyIncol,
  } = config;
  const simpleType = config.simpleType as ISimpleType;
  const showHoverEffect = simpleType === "boolean";
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const values = userAnswerExist ? userAnswer.values : [];

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
      <div css={onlyDesctopRender}>
        <PerfectScrollbar
          options={{ suppressScrollX: false, suppressScrollY: true }}
          css={wrapperCss}
        >
          <Table css={tableCss}>
            <TableHead>
              <TableRow>
                <TableCell
                  component="th"
                  css={tableHeaderColumnCss}
                ></TableCell>
                {columns.map((option) => (
                  <TableCell css={tableHeaderCellCss} key={option.docID}>
                    {option.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} css={tableRowCss(showHoverEffect)}>
                  <TableCell css={tableFirstColumnCellCss} component="th">
                    {row.title}
                  </TableCell>

                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={col.docID}
                      css={tableCellCss(showHoverEffect)}
                    >
                      <MatrixCell
                        key={rowIndex + "td" + colIndex}
                        title={col.title}
                        simpleType={simpleType}
                        rowDocID={row.docID}
                        columnDocID={col.docID}
                        value={valuesDict[`d0_${row.docID}_d1_${col.docID}`]}
                        isMultiline={config.isMultiline}
                        handleClick={handleClick}
                        handleBlur={handleBlur}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PerfectScrollbar>
      </div>
      <div css={onlyMobileRender}>
        <div css={gridCss}>
          <div css={headerCss}>
            <div className="empty-cell"></div>
            {columns.map((option) => (
              <div
                key={option.docID}
                css={headerColumnCss}
                className="table-header-cell"
              >
                {option.title}
              </div>
            ))}
          </div>

          {rows.map((row, rowIndex) => (
            <div key={rowIndex} css={rowCss}>
              <div css={thRowMobileCss} className="table-row-header">
                {row.title}
              </div>
              {columns.map((col, colIndex) => (
                <div key={colIndex} css={cellCss}>
                  <MatrixCell
                    key={rowIndex + "td" + colIndex}
                    title={col.title}
                    simpleType={simpleType}
                    rowDocID={row.docID}
                    columnDocID={col.docID}
                    value={valuesDict[`d0_${row.docID}_d1_${col.docID}`]}
                    isMultiline={config.isMultiline}
                    handleClick={handleClick}
                    handleBlur={handleBlur}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MatrixView;

//
//
// <div css={gridCss}>
//   <div css={headerCss}>
//     <div className="empty-cell"></div>
//     {columns.map((option) => (
//       <div
//         key={option.docID}
//         css={headerColumnCss}
//         className="table-header-cell"
//       >
//         {option.title}
//       </div>
//     ))}
//   </div>
//
//   {rows.map((row, rowIndex) => (
//     <div key={rowIndex} css={rowCss}>
//       <div css={thRowCss} className="table-row-header">
//         {rows[rowIndex].title}
//       </div>
//       {columns.map((col, colIndex) => (
//         <div key={colIndex} css={cellCss}>
//           <MatrixCell
//             key={rowIndex + "td" + colIndex}
//             title={col.title}
//             simpleType={simpleType}
//             rowDocID={row.docID}
//             columnDocID={col.docID}
//             value={valuesDict[`d0_${row.docID}_d1_${col.docID}`]}
//             isMultiline={config.isMultiline}
//             handleClick={handleClick}
//             handleBlur={handleBlur}
//           />
//         </div>
//       ))}
//     </div>
//   ))}
// </div>
