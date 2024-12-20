import React, { useEffect, useRef, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import { borderColorCss, freeListItemCss, freeListItemLabelCss } from ".";
import { ISimpleType, IValue } from "../../../../types";
import ErrorComponent from "../../../common/ErrorComponent";

type ITextFieldRow = {
	value: IValue;
	title: string;
	// showAlert: boolean;
	simpleType: ISimpleType;
	isMultiline: boolean;
	hint: string;
	rowDocID: number;
	handleBlur: (rowDocID: number, value: string) => void;
	handleFocus: (rowDocID: number) => void;
};

const TextFieldRow: React.FC<ITextFieldRow> = props => {
	const inputRef = useRef(null);

	// console.log(props);
	const {
		value,
		title,
		simpleType,
		isMultiline,
		hint,
		handleFocus,
		handleBlur,
		rowDocID,
	} = props;
	const storeTextValue = value ? value.value : "";
	const [textValue, setTextValue] = useState(storeTextValue);
	const isValid = value.validationResult.isValid;
	const isFocused = value.isFocused;
	const validationResult = value
		? value.validationResult
		: { isValid: true, message: "" };
	const showAlert = !isValid && !isFocused && textValue !== "";

	// useEffect(() => {
	//   setTextValue(storeTextValue);
	// }, [storeTextValue]);
	return (
		<FormControl css={freeListItemCss}>
			<FormLabel component="legend" css={freeListItemLabelCss}>
				{title}
			</FormLabel>
			<TextField
				InputProps={{
					disableUnderline: true,
					endAdornment: showAlert && (
						<InputAdornment position="end">
							<ErrorComponent validationResult={validationResult} />
						</InputAdornment>
					),
					type:
						simpleType === "integer" || simpleType === "float"
							? "number"
							: "text",
					onWheel: e => {
						inputRef.current && (inputRef.current as any).blur();
					},
				}}
				color="primary"
				variant="filled"
				css={borderColorCss(showAlert)}
				value={textValue}
				hiddenLabel
				multiline={isMultiline}
				minRows={4}
				maxRows={4}
				placeholder={hint}
				inputRef={inputRef}
				onChange={e => setTextValue(e.target.value)}
				onFocus={_e => handleFocus(rowDocID)}
				onBlur={_e => handleBlur(rowDocID, textValue)}
			/>
		</FormControl>
	);
};

export default TextFieldRow;
