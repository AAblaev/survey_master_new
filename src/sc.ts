import { css } from "@emotion/react";
import { DEFAULT_BACKGROUND_COLOR, PRIMARY_COLOR } from "./consts/const";

export const desctopCss = (backgroundColor: string) => css`
  background-color: ${backgroundColor};
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  align-items: center;
`;
//
// {docID === EXTRA_ANSWER.OTHER ? otherPlaceholder : title}
// <IconButton onClick={() => console.log("chip onClick")}>
//   <CancelIcon />
// </IconButton>

export const progressWrapperCss = (
  backgroundColor: string,
  isShowProgressbar: boolean
) => css`
  width: 100%;
  height: ${isShowProgressbar ? "55px" : "0px"};

  position: fixed;
  top: 64px;

  background-color: ${backgroundColor};
  z-index: 3;
`;

export const indentCss = (isShowProgressbar: boolean) => css`
  height: ${isShowProgressbar ? "55px" : "15px"};
`;

export const contentCss = css`
  flex: 1 0 auto;
  width: 100%;
  margin-top: 56px;
  margin-bottom: 56px;
  height: calc(100% - 112px);

  @media (min-width: 768px) {
    margin-top: 64px;
    margin-bottom: 0px;
    height: calc(100% - 128px);
  }
`;

export const homeButtonCss = css`
  // background-color: #3b424a;
  &.MuiButton-root {
    display: flex;
    justify-content: space-between;
    white-space: nowrap;
    font-size: inherit;
  }
`;

export const surveyNameCss = (showAnyway: boolean) => css`
  display: ${showAnyway ? "block" : "none"};
  text-transform: uppercase;

  &.MuiTypography-body1 {
    font-weight: 600;
    font-size: inherit;
  }

  &.MuiTypography-root {
    margin-right: auto;
  }
  @media (min-width: 768px) {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const onlyDesctopButtonCss = css`
  &.MuiButtonBase-root {
    display: none;
  }

  @media (min-width: 768px) {
    &.MuiButtonBase-root {
      display: inline-flex;
    }
  }
`;

export const transitionGroupCss = css`
  // padding-bottom: 40px;
  & > div {
    box-sizing: border-box;
  }
`;

export const modalHeaderWrapperCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const gridContainerCss = css`
  height: calc(100%-20px);
  flex-grow: 1;
  position: relative;
  display: grid;
  gap: 2%;
  grid-template-columns: 3% 90% 3%;
  grid-template-rows: auto;
  margin-top: 20px;

  @media (min-width: 576px) {
    grid-template-columns: 3% 90% 3%;
  }

  @media (min-width: 768px) {
    grid-template-columns: 8% 80% 8%;
  }

  @media (min-width: 992px) {
    grid-template-columns: 13% 70% 13%;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 18% 60% 18%;
  }
`;

export const borderCss = (backgroundColor: string) => css`
  background-color: ${backgroundColor};
  z-index: 1;
`;

export const footerCss = (brandColor: string) => css`
  width: 100%;
  height: 56px;
  background-color: ${brandColor};
  position: fixed;
  top: auto;
  bottom: 0;
  left: 0;
  right: auto;
  z-index: 3000;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const progressQuestionCountCss = (
  fontSize: number,
  color: string
) => css`
  margin-top: 20px;
  font-size: ${fontSize}px;
  font-weight: 500;
  color: ${color};
`;

//
//
// import React, { useState } from "react";
// import CheckIcon from "@mui/icons-material/Check";
// import FormControl from "@mui/material/FormControl";
// import { IAnswer, IOption, IQuestion, IState } from "../../../../types";
// import { MenuItem, TextField } from "@mui/material";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import IconButton from "@mui/material/IconButton";
// import CancelIcon from "@mui/icons-material/Cancel";
// import Chip from "@mui/material/Chip";
//
// import { DEFAULT_HINT_VALUE, EXTRA_ANSWER } from "../../../../consts/const";
// import {
//   chipCss,
//   chipWrapperCss,
//   formControlCss,
//   iconCss,
//   menuItemCss,
//   selectCss,
//   textFieldCss,
// } from "./sc";
// import { useSelector } from "react-redux";
// import { getBrandColor } from "../../../../services/redux/selectors";
// import { IViewComponentProps } from "../..";
//
// const MultiDropDownView: React.FC<IViewComponentProps> = ({
//   question,
//   setAnswer,
//   userAnswer,
// }) => {
//   const [open, setOpen] = useState(false);
//   const { brandColor } = useSelector(getBrandColor);
//
//   const {
//     docID,
//     hint,
//     config,
//     hasNothingAnswer,
//     hasOtherAnswer,
//     nothingPlaceholder,
//     otherPlaceholder,
//   } = question;
//   const hasOtherInUserAnswer =
//     userAnswer &&
//     userAnswer.values.length > 0 &&
//     userAnswer.values.find((v) => v.optionID === EXTRA_ANSWER.OTHER);
//
//   const options = config.options!;
//   const selectItems = [...options];
//   hasOtherAnswer &&
//     selectItems.push({
//       docID: -3,
//       height: 0,
//       order: 0,
//       photoID: 0,
//       title: otherPlaceholder,
//       width: 0,
//     });
//
//   hasNothingAnswer &&
//     selectItems.push({
//       docID: -2,
//       height: 0,
//       order: 0,
//       photoID: 0,
//       title: nothingPlaceholder,
//       width: 0,
//     });
//
//   const optionsDict = options.reduce(
//     (res, option) => ({ ...res, [`${option.docID}`]: option }),
//     {
//       default: {
//         docID: 0,
//         height: 0,
//         order: 0,
//         photoID: 0,
//         title: hint ? hint : DEFAULT_HINT_VALUE,
//         width: 0,
//       },
//       "-1": {
//         docID: -1,
//         height: 0,
//         order: 0,
//         photoID: 0,
//         title: "затрудняюсь ответить",
//         width: 0,
//       },
//       "-2": {
//         docID: -2,
//         height: 0,
//         order: 0,
//         photoID: 0,
//         title: nothingPlaceholder,
//         width: 0,
//       },
//       "-3": {
//         docID: -3,
//         height: 0,
//         order: 0,
//         photoID: 0,
//         title: "",
//         width: 0,
//       },
//     }
//   ) as { [key: string]: IOption };
//
//   const userAnswerExist = userAnswer && userAnswer.values.length > 0;
//   const value = userAnswerExist
//     ? (userAnswer as IAnswer).values.map((item) => item.optionID)
//     : ["default"];
//
//   const handleChange = (e: SelectChangeEvent<(number | string)[]>) => {
//     console.log("handleChange");
//     const optionIDs = e.target.value as (number | string)[];
//     const currentValue = optionIDs[optionIDs.length - 1];
//     const isExtra =
//       optionIDs.includes(EXTRA_ANSWER.UNABLE) ||
//       optionIDs.includes(EXTRA_ANSWER.NOTHING);
//
//     const newValue = isExtra
//       ? [
//           {
//             optionID: Number(currentValue),
//             value: String(optionsDict[currentValue].title),
//             validationResult: { isValid: true, message: "success" },
//             isFocused: false,
//           },
//         ]
//       : optionIDs
//           .filter((optionID) => optionID !== "default")
//           .map((optionID) => {
//             if (optionID === EXTRA_ANSWER.OTHER) {
//               const value = hasOtherInUserAnswer
//                 ? hasOtherInUserAnswer.value
//                 : "";
//
//               return {
//                 optionID: Number(optionID),
//                 value: value,
//                 validationResult: {
//                   isValid: value === "" ? false : true,
//                   message: "success",
//                 },
//                 isFocused: hasOtherInUserAnswer ? false : true,
//               };
//             }
//             return {
//               optionID: Number(optionID),
//               value: String(optionsDict[optionID].title),
//               validationResult: { isValid: true, message: "success" },
//               isFocused: false,
//             };
//           });
//
//     if (currentValue === EXTRA_ANSWER.OTHER && !hasOtherInUserAnswer) {
//       setOpen(false);
//     }
//     setAnswer({
//       questionID: docID,
//       values: newValue,
//     });
//   };
//
//   const preventEvent = (event) => {
//     event.preventDefault();
//   };
//
//   return (
//     <>
//       <FormControl variant="outlined" css={formControlCss}>
//         <Select
//           multiple
//           value={value}
//           open={open}
//           onOpen={(e) => {
//             console.log("onOpen", e);
//             setOpen(true);
//           }}
//           onClose={() => setOpen(false)}
//           onChange={handleChange}
//           renderValue={(items) => {
//             const ids = items as string[];
//             const options = ids.map((id: string) => optionsDict[id]);
//
//             if (
//               (ids.length === 1 && ids[0] === "default") ||
//               (ids.length === 1 &&
//                 String(ids[0]) === String(EXTRA_ANSWER.UNABLE))
//             )
//               return (
//                 <div key={docID} css={chipCss(true)}>
//                   {optionsDict["default"].title}
//                 </div>
//               );
//             return (
//               <div css={chipWrapperCss} onClick={() => console.log("onClick")}>
//                 {options.map(({ docID, title }) => (
//                   <Chip
//                     key={docID}
//                     css={chipCss(false)}
//                     onClick={() => console.log("chip onClick")}
//                     label={
//                       docID === EXTRA_ANSWER.OTHER ? otherPlaceholder : title
//                     }
//                     onDelete={() => console.log("onDelete", docID)}
//                     onMouseDown={(event) => event.stopPropagation()}
//                   ></Chip>
//                 ))}
//               </div>
//             );
//           }}
//           MenuProps={{
//             anchorOrigin: {
//               vertical: "bottom",
//               horizontal: "right",
//             },
//             transformOrigin: {
//               vertical: "top",
//               horizontal: "right",
//             },
//           }}
//           css={selectCss}
//         >
//           {selectItems.map((item) => (
//             <MenuItem key={item.docID} value={item.docID} css={menuItemCss}>
//               <CheckIcon
//                 css={iconCss(
//                   (value as number[]).includes(item.docID),
//                   brandColor
//                 )}
//               />
//               <span>
//                 {item.docID === EXTRA_ANSWER.OTHER
//                   ? otherPlaceholder
//                   : item.title}
//               </span>
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//       {Boolean(hasOtherInUserAnswer) && (
//         <TextField
//           id={"otherTextField" + docID}
//           css={textFieldCss}
//           autoFocus
//           InputProps={{ disableUnderline: true }}
//           placeholder="напишите свой вариант"
//           label=""
//           color="primary"
//           fullWidth
//           multiline
//           minRows={3}
//           variant="filled"
//           value={hasOtherInUserAnswer ? hasOtherInUserAnswer.value : ""}
//           onFocus={(e) => {
//             const values = userAnswer.values;
//             const newValues = values.map((value) => {
//               if (value.optionID === EXTRA_ANSWER.OTHER) {
//                 const isValid = e.target.value !== "";
//                 return {
//                   optionID: EXTRA_ANSWER.OTHER,
//                   value: e.target.value,
//                   validationResult: { isValid: isValid, message: "success" },
//                   isFocused: true,
//                 };
//               }
//
//               return value;
//             });
//             setAnswer({
//               questionID: docID,
//               values: newValues,
//             });
//           }}
//           onBlur={(e) => {
//             const values = userAnswer.values;
//             const newValues = values.map((value) => {
//               if (value.optionID === EXTRA_ANSWER.OTHER) {
//                 const isValid = e.target.value !== "";
//                 return {
//                   optionID: EXTRA_ANSWER.OTHER,
//                   value: e.target.value,
//                   validationResult: { isValid: isValid, message: "success" },
//                   isFocused: false,
//                 };
//               }
//
//               return value;
//             });
//             setAnswer({
//               questionID: docID,
//               values: newValues,
//             });
//           }}
//           onChange={(e) => {
//             const values = userAnswer.values;
//             const newValues = values.map((value) => {
//               if (value.optionID === EXTRA_ANSWER.OTHER) {
//                 const isValid = e.target.value !== "";
//                 return {
//                   optionID: EXTRA_ANSWER.OTHER,
//                   value: e.target.value,
//                   validationResult: { isValid: isValid, message: "success" },
//                   isFocused: true,
//                 };
//               }
//
//               return value;
//             });
//             setAnswer({
//               questionID: docID,
//               values: newValues,
//             });
//           }}
//         />
//       )}
//     </>
//   );
// };
//
// export default MultiDropDownView;
