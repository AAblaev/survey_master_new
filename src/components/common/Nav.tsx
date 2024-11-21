import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IPage } from "../../types";
import { css } from "@emotion/react";
import { homeButtonCss } from "../../sc";
import { withStyles } from "@mui/styles";
const StyledMenu = withStyles({
	paper: {
		border: "1px solid #d3d4d5",
	},
})((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "left",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "left",
		}}
		{...props}
	/>
));

const menuItemCss = css``;

type INavProps = {
	title: string;
	pageList: IPage[];
	showList: boolean;
	selectPage: (pageDocID: string) => void;
	// isShowPageList: boolean;
};

const Nav: React.FC<INavProps> = ({
	title,
	pageList,
	selectPage,
	showList,
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	// const showList = pageList.length > 1;
	const { t } = useTranslation();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		showList && setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button css={homeButtonCss} onClick={handleClick} color="inherit">
				{title}
				{showList && <ExpandMoreIcon />}
			</Button>
			<StyledMenu
				id="customized-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{pageList.map((page, pageIndex) => {
					return (
						<MenuItem
							key={pageIndex}
							css={menuItemCss}
							onClick={() => {
								selectPage(String(page.docID));
								handleClose();
							}}
						>
							<ListItemText
								primary={
									page.title ? page.title : `${t("page")} ${pageIndex + 1}`
								}
							/>
						</MenuItem>
					);
				})}
			</StyledMenu>
		</div>
	);
};

export default Nav;
