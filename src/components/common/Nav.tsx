import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import { homeButtonCss } from "../../Desktop";
import { IPage, ISlideMoveDirection } from "../../types";
import { css } from "@emotion/react";
import { PRIMARY_COLOR } from "../../consts/const";

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
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const menuItemCss = css``;

type INavProps = {
  title: string;
  currentPageIndex: number;
  pages: IPage[];
  onChange: (
    pageIndex: number,
    slideMoveDirection: ISlideMoveDirection
  ) => void;
};

const Nav: React.FC<INavProps> = ({
  title,
  currentPageIndex,
  pages,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button css={homeButtonCss} onClick={handleClick}>
        {title}
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {pages.map((page, pageIndex) => (
          <MenuItem
            key={pageIndex}
            css={menuItemCss}
            onClick={() => {
              onChange(
                pageIndex,
                currentPageIndex < pageIndex ? "right-to-left" : "left-to-right"
              );
              handleClose();
            }}
          >
            <ListItemText
              primary={page.title ? page.title : `Страница ${pageIndex + 1}`}
            />
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
};

export default Nav;

// <Button key="nav" css={homeButtonCss} onClick={() => {}}>
//   <span>
//     {page.title ? page.title : `Страница ${pageIndex + 1}`}
//   </span>
//   <ArrowDropDownIcon />
// </Button>
