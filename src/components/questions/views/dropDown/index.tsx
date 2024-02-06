import React from "react";
import FormControl from "@mui/material/FormControl";
import { IAnswer, IOption, IQuestion } from "../../../../types";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { DEFAULT_HINT_VALUE, EXTRA_ANSWER } from "../../../../consts/const";
import { formControlCss, renderValueCss, textFieldCss } from "./sc";
import { selectCss } from "../multiDropDown/sc";
import { IViewComponentProps } from "../..";

const DropDownView: React.FC<IViewComponentProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const {
    docID,
    config,
    hint,
    hasNothingAnswer,
    hasOtherAnswer,
    nothingPlaceholder,
    otherPlaceholder,
  } = question;

  const options = config.options!;
  const selectItems = [...options];
  hasOtherAnswer &&
    selectItems.push({
      docID: -3,
      height: 0,
      order: 0,
      photoID: 0,
      title: otherPlaceholder,
      width: 0,
    });

  hasNothingAnswer &&
    selectItems.push({
      docID: -2,
      height: 0,
      order: 0,
      photoID: 0,
      title: nothingPlaceholder,
      width: 0,
    });

  const optionsDict = options.reduce(
    (res, option) => ({ ...res, [`${option.docID}`]: option }),
    {
      default: {
        docID: -99,
        height: 0,
        order: 0,
        photoID: 0,
        title: hint ? hint : DEFAULT_HINT_VALUE,
        width: 0,
      },
      "-1": {
        docID: -1,
        height: 0,
        order: 0,
        photoID: 0,
        title: "затрудняюсь ответить",
        width: 0,
      },
      "-2": {
        docID: -2,
        height: 0,
        order: 0,
        photoID: 0,
        title: nothingPlaceholder,
        width: 0,
      },
      "-3": {
        docID: -3,
        height: 0,
        order: 0,
        photoID: 0,
        title: otherPlaceholder,
        width: 0,
      },
    }
  ) as { [key: string]: IOption };

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const value = userAnswerExist
    ? optionsDict[(userAnswer.values as IAnswer["values"])[0].optionID].docID
    : "";

  const autoFocus = userAnswerExist && userAnswer.values[0].value === "";

  const handleChange = (e: SelectChangeEvent<number>) => {
    const optionID = Number(e.target.value) as number;
    const isValid = optionID !== EXTRA_ANSWER.OTHER;
    setAnswer({
      questionID: docID,
      values: [
        {
          optionID: optionID,
          value:
            optionID === EXTRA_ANSWER.OTHER
              ? ""
              : String(optionsDict[optionID].title),
          validationResult: { isValid: isValid, message: "success" },
          isFocused: false,
        },
      ],
    });
  };

  return (
    <>
      <FormControl variant="outlined" css={formControlCss}>
        <Select
          value={value}
          onChange={handleChange}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          }}
          displayEmpty={true}
          renderValue={(value: any) => {
            return (
              <div css={renderValueCss(value === "")}>
                {value === "" || value === EXTRA_ANSWER.UNABLE
                  ? optionsDict["default"].title
                  : optionsDict[value].title}
              </div>
            );
          }}
          css={selectCss}
        >
          {selectItems.map((item) => (
            <MenuItem key={item.docID} value={item.docID}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {value === EXTRA_ANSWER.OTHER && (
        <TextField
          id={"otherTextField" + docID}
          css={textFieldCss}
          autoFocus={autoFocus}
          InputProps={{ disableUnderline: true }}
          placeholder="напишите свой вариант"
          label=""
          color="primary"
          fullWidth
          multiline
          minRows={3}
          variant="filled"
          value={userAnswer.values[0].value}
          onFocus={(e) => {
            setAnswer({
              questionID: docID,
              values: [{ ...userAnswer.values[0], isFocused: true }],
            });
          }}
          onBlur={(e) => {
            setAnswer({
              questionID: docID,
              values: [{ ...userAnswer.values[0], isFocused: false }],
            });
          }}
          onChange={(e) => {
            const isValid = e.target.value === "" ? false : true;
            setAnswer({
              questionID: docID,
              values: [
                {
                  optionID: EXTRA_ANSWER.OTHER,
                  value: e.target.value,
                  validationResult: { isValid: isValid, message: "success" },
                  isFocused: true,
                },
              ],
            });
          }}
        />
      )}
    </>
  );
};

export default DropDownView;
