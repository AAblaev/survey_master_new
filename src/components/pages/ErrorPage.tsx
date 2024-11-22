import React from "react";
import { borderCss, contentCss, gridContainerCss } from "../../sc";

type IErrorPage = {
	message: string;
	backgroundColor: string;
};

const ErrorPage: React.FC<IErrorPage> = ({ message, backgroundColor }) => {
	return (
		<div css={contentCss}>
			<div css={gridContainerCss}>
				<div css={borderCss(backgroundColor)}></div>
				<div dangerouslySetInnerHTML={{ __html: message }}></div>
				<div css={borderCss(backgroundColor)}></div>
			</div>
		</div>
	);
};
export default ErrorPage;
