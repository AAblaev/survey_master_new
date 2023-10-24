import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { IPage } from "../../types";
import { css } from "@emotion/react";
import { homeButtonCss } from "../../sc";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
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
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    showList && setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button css={homeButtonCss} onClick={handleClick}>
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
                primary={page.title ? page.title : `Страница ${pageIndex + 1}`}
              />
            </MenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );
};

export default Nav;
