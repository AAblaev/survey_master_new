import React, { useState } from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import PerfectScrollbar from "react-perfect-scrollbar";

import Menu, { MenuProps } from "@material-ui/core/Menu";
import CloseIcon from "@material-ui/icons/Close";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";

import { IconButton, ListItemText, MenuItem } from "@material-ui/core";
import Link, { LinkProps } from "@material-ui/core/Link";

import SettingsIcon from "@material-ui/icons/Settings";
import { ILocation, ISlideMoveDirection, IState } from "../../../types";
import {
  COMPLETE_SURVEY,
  FETCH_SURVEY_DATA,
  SEND_SURVEY_DATA,
  SET_VISITED_PAGE_DOCID,
  TOGGLE_MODAL_VISIBLE,
} from "../../../services/redux/types";
import { changeCurretLocation } from "../../../services/redux/actions";
import { Modal, ModalContent, ModalHeader } from "../../common/modal";
import { modalHeaderWrapperCss } from "../../../sc";
import { PATH_NAME } from "../../../services/api/const";
import { settingsButtonCss } from "./sc";

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

const StyledLink = withStyles({
  root: {
    whiteSpace: "nowrap", // Запрещаем перенос текста на новую строку
    // overflowX: "auto", // Добавляем горизонтальный скролл при переполнении
    textOverflow: "elipsis",
    maxWidth: "100%", // Ограничиваем максимальную ширину
    // height: "100%",
    display: "block",
  },
})((props: LinkProps) => <Link {...props} />);

export type IMenuProps = ConnectedProps<typeof connector>;

const AppBarMenu: React.FC<IMenuProps> = ({
  location,
  isShowPageList,
  isEmptyData,
  handleClick,
  sendData,
  surveyID,
  uid,
}) => {
  if (
    isEmptyData ||
    location.pathName === "greeting" ||
    location.pathName === "completion"
  ) {
    return null;
  }
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const menuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const menuClose = () => {
    setAnchorEl(null);
  };

  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  const linkValue =
    document.location.origin + "/?surveyID=" + surveyID + "&uid=" + uid;

  const copyToClipboard = () => {
    const textField = document.createElement("textarea");
    textField.innerText = linkValue;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };
  return (
    <div style={{ marginLeft: "10px" }}>
      <IconButton css={settingsButtonCss} onClick={menuOpen} color="inherit">
        <SettingsIcon />
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
            setModalVisible(true);
            sendData();
            menuClose();
          }}
        >
          <ListItemText primary="Продолжить на другом устройстве" />
        </MenuItem>
      </StyledMenu>

      <Modal visible={modalVisible} onClosed={closeModal} size="sm">
        <ModalHeader>
          <div css={modalHeaderWrapperCss}>
            <span>Ссылка</span>
            <IconButton onClick={() => closeModal()}>
              <CloseIcon />
            </IconButton>
          </div>
        </ModalHeader>
        <ModalContent>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              gap: "10px",
            }}
          >
            <PerfectScrollbar options={{ suppressScrollY: true }}>
              <div style={{ padding: "15px 10px 25px 0px" }}>
                <StyledLink onClick={preventDefault}>{linkValue}</StyledLink>
              </div>
            </PerfectScrollbar>
            <IconButton
              onClick={() => {
                copyToClipboard();
              }}
            >
              <FileCopyOutlinedIcon />
            </IconButton>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const {
    location,
    slideMoveDirection,
    userAnswers,
    modalVisible,
    data,
    params,
    strictModeNavigation,
  } = state;

  const isEmptyData = !Boolean(data);
  const buttonStartCaption = data?.buttonStartCaption || "";
  const buttonNextCaption = data?.buttonNextCaption || "";
  const buttonBackCaption = data?.buttonBackCaption || "";
  const buttonFinishCaption = data?.buttonFinishCaption || "";
  const isShowPageList = data?.isShowPageList || false;
  const isShowButtonBack = data?.isShowButtonBack || false;

  const pages = data?.pages || [];
  const pagesCount = pages.length;
  const surveyID = params.surveyID;
  const uid = params.uid;

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
    isShowPageList: isShowPageList && isShowButtonBack,
    pages,
    pagesCount,
    surveyID,
    uid,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
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

    sendData: () => dispatch({ type: SEND_SURVEY_DATA }),
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(AppBarMenu);
