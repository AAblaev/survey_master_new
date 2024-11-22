import { css } from "@emotion/react";

export const datePickerCss = css`
	& .MuiInputBase-root {
		// width: 10rem;
		border-radius: 0px;
	}
	& .MuiInputBase-input {
		padding: 10px 0px 10px 10px;
	}
	& .MuiOutlinedInput-notchedOutline {
		border: 0;
	}
`;

export const textFieldWrapperCss = (showAlert: boolean) => css`
	display: flex;
	align-items: center;
	position: relative;
	border: 1px solid ${showAlert ? "red" : "#e5e5e5"};
	width: 97%;
`;

export const alertCss = css`
	position: absolute;
	top: 0px;
	right: -40px;
	z-index: 1000000000;
`;

export const freeListItemCss = css`
	margin-top: 10px !important;
	margin-bottom: 10px !important;
`;

export const freeListItemLabelCss = css`
	font-size: 0.8rem !important;
	// color: #787878 !important;
	margin-bottom: 0.5em;
`;

export const dateListCss = css`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;
