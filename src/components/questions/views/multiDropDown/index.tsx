import React, { useState } from "react";
import CheckIcon from "@material-ui/icons/Check";
import FormControl from "@material-ui/core/FormControl";
import { IAnswer, IOption, IQuestion, IState } from "../../../../types";
import { MenuItem, Select, TextField } from "@material-ui/core";
import { DEFAULT_HINT_VALUE, EXTRA_ANSWER } from "../../../../consts/const";
import {
  chipCss,
  chipWrapperCss,
  formControlCss,
  iconCss,
  menuItemCss,
  selectCss,
  textFieldCss,
} from "./sc";
import { useSelector } from "react-redux";
import { getBrandColor } from "../../../../services/redux/selectors";

type IMultiDropDownViewProps = {
  currentQuestionIndex: number;
  question: IQuestion;
  setAnswer: (answer: IAnswer) => void;
  validation: (question: IQuestion) => void;
  userAnswer: IAnswer;
};

const MultiDropDownView: React.FC<IMultiDropDownViewProps> = ({
  question,
  setAnswer,
  userAnswer,
}) => {
  const [open, setOpen] = useState(false);
  const { brandColor } = useSelector(getBrandColor);

  const {
    docID,
    hint,
    config,
    hasNothingAnswer,
    hasOtherAnswer,
    nothingPlaceholder,
    otherPlaceholder,
  } = question;
  const hasOtherInUserAnswer =
    userAnswer &&
    userAnswer.values.length > 0 &&
    userAnswer.values.find((v) => v.optionID === EXTRA_ANSWER.OTHER);

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
        docID: 0,
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
        title: "",
        width: 0,
      },
    }
  ) as { [key: string]: IOption };

  const userAnswerExist = userAnswer && userAnswer.values.length > 0;
  const value = userAnswerExist
    ? (userAnswer as IAnswer).values.map((item) => item.optionID)
    : ["default"];

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const optionIDs = e.target.value as (number | string)[];
    const currentValue = optionIDs[optionIDs.length - 1];
    const isExtra =
      optionIDs.includes(EXTRA_ANSWER.UNABLE) ||
      optionIDs.includes(EXTRA_ANSWER.NOTHING);

    const newValue = isExtra
      ? [
          {
            optionID: Number(currentValue),
            value: String(optionsDict[currentValue].title),
            validationResult: { isValid: true, message: "success" },
            isFocused: false,
          },
        ]
      : optionIDs
          .filter((optionID) => optionID !== "default")
          .map((optionID) => {
            if (optionID === EXTRA_ANSWER.OTHER) {
              const value = hasOtherInUserAnswer
                ? hasOtherInUserAnswer.value
                : "";

              return {
                optionID: Number(optionID),
                value: value,
                validationResult: {
                  isValid: value === "" ? false : true,
                  message: "success",
                },
                isFocused: hasOtherInUserAnswer ? false : true,
              };
            }
            return {
              optionID: Number(optionID),
              value: String(optionsDict[optionID].title),
              validationResult: { isValid: true, message: "success" },
              isFocused: false,
            };
          });

    if (currentValue === EXTRA_ANSWER.OTHER && !hasOtherInUserAnswer) {
      setOpen(false);
    }
    setAnswer({
      questionID: docID,
      values: newValue,
    });
  };

  return (
    <>
      <FormControl variant="outlined" css={formControlCss}>
        <Select
          multiple
          value={value}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onChange={handleChange}
          renderValue={(items) => {
            const ids = items as string[];
            const options = ids.map((id: string) => optionsDict[id]);

            if (
              (ids.length === 1 && ids[0] === "default") ||
              (ids.length === 1 &&
                String(ids[0]) === String(EXTRA_ANSWER.UNABLE))
            )
              return (
                <div key={docID} css={chipCss(true)}>
                  {optionsDict["default"].title}
                </div>
              );
            return (
              <div css={chipWrapperCss}>
                {options.map(({ docID, title }) => (
                  <div key={docID} css={chipCss(false)}>
                    {docID === EXTRA_ANSWER.OTHER ? otherPlaceholder : title}
                  </div>
                ))}
              </div>
            );
          }}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            getContentAnchorEl: null,
          }}
          css={selectCss}
        >
          {selectItems.map((item) => (
            <MenuItem key={item.docID} value={item.docID} css={menuItemCss}>
              <CheckIcon
                css={iconCss(
                  (value as number[]).includes(item.docID),
                  brandColor
                )}
              />
              <span>
                {item.docID === EXTRA_ANSWER.OTHER
                  ? otherPlaceholder
                  : item.title}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {Boolean(hasOtherInUserAnswer) && (
        <TextField
          id={"otherTextField" + docID}
          css={textFieldCss}
          autoFocus
          InputProps={{ disableUnderline: true }}
          placeholder="напишите свой вариант"
          label=""
          color="primary"
          fullWidth
          multiline
          minRows={3}
          variant="filled"
          value={hasOtherInUserAnswer ? hasOtherInUserAnswer.value : ""}
          onFocus={(e) => {
            const values = userAnswer.values;
            const newValues = values.map((value) => {
              if (value.optionID === EXTRA_ANSWER.OTHER) {
                const isValid = e.target.value !== "";
                return {
                  optionID: EXTRA_ANSWER.OTHER,
                  value: e.target.value,
                  validationResult: { isValid: isValid, message: "success" },
                  isFocused: true,
                };
              }

              return value;
            });
            setAnswer({
              questionID: docID,
              values: newValues,
            });
          }}
          onBlur={(e) => {
            const values = userAnswer.values;
            const newValues = values.map((value) => {
              if (value.optionID === EXTRA_ANSWER.OTHER) {
                const isValid = e.target.value !== "";
                return {
                  optionID: EXTRA_ANSWER.OTHER,
                  value: e.target.value,
                  validationResult: { isValid: isValid, message: "success" },
                  isFocused: false,
                };
              }

              return value;
            });
            setAnswer({
              questionID: docID,
              values: newValues,
            });
          }}
          onChange={(e) => {
            const values = userAnswer.values;
            const newValues = values.map((value) => {
              if (value.optionID === EXTRA_ANSWER.OTHER) {
                const isValid = e.target.value !== "";
                return {
                  optionID: EXTRA_ANSWER.OTHER,
                  value: e.target.value,
                  validationResult: { isValid: isValid, message: "success" },
                  isFocused: true,
                };
              }

              return value;
            });
            setAnswer({
              questionID: docID,
              values: newValues,
            });
          }}
        />
      )}
    </>
  );
};

export default MultiDropDownView;
