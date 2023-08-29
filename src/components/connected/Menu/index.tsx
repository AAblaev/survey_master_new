import React from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Menu, { MenuProps } from "@material-ui/core/Menu";

import { Button, IconButton, ListItemText, MenuItem } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { ILocation, ISlideMoveDirection, IState } from "../../../types";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  SET_VISITED_PAGE_DOCID,
  START_SURVEY,
  TOGGLE_MODAL_VISIBLE,
} from "../../../services/redux/types";
import { changeCurretLocation } from "../../../services/redux/actions";
import getPrevAndNextLocation from "../../../utils/getPrevAndNextLocation";

import {
  findFirstIncompleteQuestion,
  sectionValidtion,
} from "../../../utils/questionIsDone";
import { buttonCss, iconBtnCss } from "./sc";
import { homeButtonCss, onlyDesctopButtonCss } from "../../../sc";
import Nav from "../../common/Nav";

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
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
));

export type IMenuProps = ConnectedProps<typeof connector>;

const AppBarMenu: React.FC<IMenuProps> = ({
  location,
  isShowPageList,
  isEmptyData,
  openModal,
  handleClick,
}) => {
  if (
    isEmptyData ||
    location.pathName === "greeting" ||
    location.pathName === "completion"
  ) {
    return null;
  }
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { pageIndex, pathName } = location;

  const menuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const menuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ marginLeft: "10px" }}>
      <IconButton onClick={menuOpen}>
        <SettingsIcon style={{ color: "#fff" }} />
      </IconButton>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={menuClose}
      >
        {isShowPageList && (
          <MenuItem
            key="toMain"
            onClick={() => {
              handleClick({
                location: {
                  pageIndex: 0,
                  pathName: "survey",
                  questionIndex: 0,
                  title: "survey",
                },
                needSendAnswers: true,
                slideMoveDirection: "left-to-right",
              });
              menuClose();
            }}
          >
            <ListItemText primary="На главную" />
          </MenuItem>
        )}
        <MenuItem
          key="save"
          onClick={() => {
            // openModal();
            menuClose();
          }}
        >
          <ListItemText primary="Продолжить на другом устройстве" />
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

// switch (location.pathName) {
//     return (
//       <>
//         <Button
//           key="1"
//           css={buttonCss(true, "right")}
//           onClick={() => {
//             handleClick({
//               location: {
//                 pageIndex: 0,
//                 questionIndex: 0,
//                 pathName: isShowPageList ? "survey" : "section",
//                 title: isShowPageList ? "survey" : "section",
//               },
//               slideMoveDirection: "right-to-left",
//               needSendAnswers: false,
//             });
//             startSurvey();
//           }}
//         >
//           {buttonStartCaption}
//         </Button>
//       </>
//     );
//   }
//   case "survey": {
//     return (
//       <>
//         <Button
//           key="1"
//           css={buttonCss(true, "right")}
//           onClick={() =>
//             handleClick({
//               location: {
//                 pageIndex: 0,
//                 questionIndex: 0,
//                 pathName: "section",
//                 title: "section",
//               },
//               slideMoveDirection: "right-to-left",
//               needSendAnswers: false,
//             })
//           }
//         >
//           {buttonNextCaption}
//         </Button>
//
//         <IconButton
//           key="IconButton1"
//           css={iconBtnCss("right")}
//           onClick={() =>
//             handleClick({
//               location: {
//                 pageIndex: 0,
//                 questionIndex: 0,
//                 pathName: "section",
//                 title: "section",
//               },
//               slideMoveDirection: "right-to-left",
//               needSendAnswers: false,
//             })
//           }
//         >
//           <ChevronRightIcon fontSize="large" />
//         </IconButton>
//         <IconButton
//           key="IconButton2"
//           css={iconBtnCss("left")}
//           disabled
//           onClick={() =>
//             handleClick({
//               location: prevLocation,
//               slideMoveDirection: "left-to-right",
//               needSendAnswers: true,
//             })
//           }
//         >
//           <ChevronRightIcon fontSize="large" />
//         </IconButton>
//       </>
//     );
//   }
//   case "section": {
//     return (
//       <>
//         {isShowPageList ? (
//           <Button
//             key="home"
//             css={homeButtonCss}
//             onClick={() =>
//               handleClick({
//                 location: {
//                   pageIndex: 0,
//                   questionIndex: 0,
//                   pathName: "survey",
//                   title: "survey",
//                 },
//                 slideMoveDirection: "left-to-right",
//                 needSendAnswers: true,
//               })
//             }
//           >
//             К списку страниц
//           </Button>
//         ) : (
//           <Nav
//             title={pageTitle}
//             pages={pages}
//             currentPageIndex={pageIndex}
//             onChange={(pageIndex, slideMoveDirection) => {
//               handleClick({
//                 location: {
//                   pageIndex: pageIndex,
//                   pathName: "section",
//                   questionIndex: 0,
//                   title: "section",
//                 },
//                 needSendAnswers: true,
//                 slideMoveDirection: slideMoveDirection,
//               });
//             }}
//           />
//         )}
//
//         <Button
//           key="1"
//           css={buttonCss(true, "right")}
//           onClick={() => {
//             nextLocation.pageIndex === pagesCount
//               ? completeSurvey()
//               : rightClick();
//           }}
//         >
//           {nextLocation.pageIndex === pagesCount
//             ? buttonFinishCaption
//             : buttonNextCaption}
//         </Button>
//
//         <Button
//           key="2"
//           css={buttonCss(showBackBtn, "left")}
//           onClick={() =>
//             handleClick({
//               location: prevLocation,
//               slideMoveDirection: "left-to-right",
//               needSendAnswers: true,
//             })
//           }
//         >
//           {buttonBackCaption}
//         </Button>
//
//         <IconButton
//           key="IconButton1"
//           css={iconBtnCss("right")}
//           disabled={nextLocation.pageIndex === pagesCount}
//           onClick={() => {
//             rightClick();
//           }}
//         >
//           <ChevronRightIcon fontSize="large" />
//         </IconButton>
//         <IconButton
//           key="IconButton2"
//           css={iconBtnCss("left")}
//           disabled={!isShowPageList && prevLocation.pathName === "survey"}
//           onClick={() =>
//             handleClick({
//               location: prevLocation,
//               slideMoveDirection: "left-to-right",
//               needSendAnswers: true,
//             })
//           }
//         >
//           <ChevronRightIcon fontSize="large" />
//         </IconButton>
//       </>
//     );
//   }
// }

const mapStateToProps = (state: IState) => {
  const {
    location,
    slideMoveDirection,
    userAnswers,
    modalVisible,
    data,
  } = state;

  const isEmptyData = !Boolean(data);
  const buttonStartCaption = data?.buttonStartCaption || "";
  const buttonNextCaption = data?.buttonNextCaption || "";
  const buttonBackCaption = data?.buttonBackCaption || "";
  const buttonFinishCaption = data?.buttonFinishCaption || "";
  const isShowPageList = data?.isShowPageList || false;
  const pages = data?.pages || [];
  const pagesCount = pages.length;

  // console.log("pages", pages);

  return {
    isEmptyData,
    userAnswers,
    location,
    slideMoveDirection,
    modalVisible,
    buttonStartCaption,
    buttonNextCaption,
    buttonBackCaption,
    buttonFinishCaption,
    isShowPageList,
    pages,
    pagesCount,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    fetchData: () => dispatch({ type: FETCH_SURVEY_DATA }),
    startSurvey: () => dispatch({ type: START_SURVEY }),
    openModal: () => dispatch({ type: TOGGLE_MODAL_VISIBLE, payload: true }),
    closeModal: () => dispatch({ type: TOGGLE_MODAL_VISIBLE, payload: false }),
    submit: () => {
      dispatch({ type: COMPLETE_SURVEY });
      dispatch(
        changeCurretLocation({
          location: {
            pageIndex: 0,
            questionIndex: 0,
            pathName: "completion",
            title: "completion",
          },
          slideMoveDirection: "right-to-left",
        })
      );
    },
    handleClick: (payload: {
      location: ILocation;
      slideMoveDirection: ISlideMoveDirection;
      needSendAnswers: boolean;
    }) => {
      const { location, slideMoveDirection, needSendAnswers } = payload;
      dispatch(
        changeCurretLocation({
          location: location,
          slideMoveDirection: slideMoveDirection,
        })
      );
      needSendAnswers && dispatch({ type: SEND_SURVEY_DATA });
    },
    noticePage: (docID: string) => {
      dispatch({ type: SET_VISITED_PAGE_DOCID, payload: docID });
    },
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(AppBarMenu);
