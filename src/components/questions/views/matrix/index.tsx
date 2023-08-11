import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import GreenRadio from "../../../common/GreenRadio";
import {
  IAnswer,
  IOption,
  IQuestion,
  ISimpleType,
  IValue,
} from "../../../../types";
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
import BoolCell from "./BoolCell";
import TextFieldCell from "./TextCell";
import { validation } from "../../../../utils/validation";

type IMatrixViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  userAnswer: IAnswer;
  validation: (question: IQuestion) => void;
};

type IValuesDict = { [key: string]: string };
type IValuesDict2 = { [key: string]: IValue };

const MatrixView: React.FC<IMatrixViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, config } = question;
  const { isLimited, isLimitedValue, limit, limitValue } = config;
  const simpleType = config.simpleType as ISimpleType;
  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const values = userAnswerExist ? userAnswer.values : [];

  const valuesDict2: IValuesDict2 = values.reduce((acc: IValuesDict2, item) => {
    acc[String(item.optionID)] = item;
    return acc;
  }, {});

  const columns = question.config.options!.filter(
    (option) => option.dimension === 1
  );
  const rows = question.config.options!.filter(
    (option) => option.dimension === 0
  );

  const handleClick = (rowDocID: number, columnDocID: number) => {
    const newValues = values.filter(
      (value) => Number(value.optionID) !== rowDocID
    );
    setAnswer({
      questionID: docID,
      values: [
        ...newValues,
        {
          optionID: String(rowDocID),
          value: String(columnDocID),
          validationResult: { isValid: true, message: "success" },
          isFocused: false,
        },
      ],
    });
  };

  const handleChange = (
    rowDocID: number,
    columnDocID: number,
    value: string
  ) => {
    const newValues = values.filter(
      (value) => value.optionID !== rowDocID + "col" + columnDocID
    );
    setAnswer({
      questionID: docID,
      values: [
        ...newValues,
        {
          optionID: rowDocID + "col" + columnDocID,
          value: value,
          validationResult: { isValid: true, message: "success" },
          isFocused: false,
        },
      ],
    });
  };

  const handleBlur = (rowDocID: number, columnDocID: number, value: string) => {
    const newValues = values.filter(
      (value) => value.optionID !== rowDocID + "col" + columnDocID
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
    // console.log("validationResult", validationResult.isValid);
    setAnswer({
      questionID: docID,
      values: [
        ...newValues,
        {
          optionID: rowDocID + "col" + columnDocID,
          value: value,
          validationResult: validationResult,
          isFocused: false,
        },
      ],
    });
  };

  return (
    <PerfectScrollbar
      options={{ suppressScrollX: false, suppressScrollY: true }}
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
              {columns.map((option, chIndex) => {
                if (simpleType === "boolean") {
                  return (
                    <BoolCell
                      key={rhIndex + "td" + chIndex}
                      rowDocID={rh.docID}
                      columnDocID={option.docID}
                      isChecked={Boolean(
                        valuesDict2[rh.docID] &&
                          valuesDict2[rh.docID].value === String(option.docID)
                      )}
                      handleClick={handleClick}
                      title={option.title}
                    />
                  );
                }
                if (
                  simpleType === "string" ||
                  simpleType === "integer" ||
                  simpleType === "float"
                )
                  return (
                    <TextFieldCell
                      key={rhIndex + "td" + chIndex}
                      rowDocID={rh.docID}
                      columnDocID={option.docID}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      value={valuesDict2[rh.docID + "col" + option.docID]}
                      title={option.title}
                      config={config}
                    />
                  );

                return null;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </PerfectScrollbar>
  );
};

export default MatrixView;
