import React from "react";
import { Dispatch } from "redux";
import { Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { connect, ConnectedProps } from "react-redux";
import { ModalContent, ModalHeader } from "../../common/modal";
import { modalHeaderWrapperCss, onlyDesctopButtonCss } from "../../../sc";
import { buttonsWrapperCss } from "../../pages/sc";
import { IState } from "../../../types";
import {
  COMPLETE_SURVEY,
  SAGA_START_AGAIN,
  START_SURVEY,
} from "../../../services/redux/types";
import { goToFirstDeviationPage } from "../../../services/redux/actions";

type IModalContentComponentProps = {
  closeModal: () => void;
};

export type IOwnModalContentComponentProps = IModalContentComponentProps &
  ConnectedProps<typeof connector>;

const ModalContentComponent: React.FC<IOwnModalContentComponentProps> = ({
  modalMessage,
  closeModal,
  startSurvey,
  continueSurvey,
  completeSurvey,
  goToQuesions,
}) => {
  // console.log("modalMessage.code", modalMessage.code);
  switch (modalMessage.code) {
    case 101: {
      return (
        <>
          <ModalHeader>
            <div css={modalHeaderWrapperCss}>
              <span>Здравствуйте</span>
              <IconButton onClick={() => closeModal()}>
                <CloseIcon />
              </IconButton>
            </div>
          </ModalHeader>
          <ModalContent>
            <Typography variant="h6">Хотите ли вы продолжить?</Typography>
            <div css={buttonsWrapperCss}>
              <Button
                key="start"
                variant="outlined"
                color="primary"
                onClick={() => {
                  startSurvey();
                }}
              >
                начать заново
              </Button>

              <Button
                key="continue"
                variant="contained"
                onClick={() => {
                  continueSurvey();
                  closeModal();
                }}
              >
                Продолжить
              </Button>
            </div>
          </ModalContent>
        </>
      );
    }
    case 201: {
      return (
        <>
          <ModalHeader>
            <div css={modalHeaderWrapperCss}>
              <span>Отмена</span>
              <IconButton onClick={() => closeModal()}>
                <CloseIcon />
              </IconButton>
            </div>
          </ModalHeader>
          <ModalContent>
            <Typography variant="h6">
              Пожауйста, ответьте на обязательные вопросы
            </Typography>
          </ModalContent>
        </>
      );
    }
    case 202: {
      return (
        <>
          <ModalHeader>
            <div css={modalHeaderWrapperCss}>
              <span>Отмена</span>
              <IconButton onClick={() => closeModal()}>
                <CloseIcon />
              </IconButton>
            </div>
          </ModalHeader>
          <ModalContent>
            <Typography variant="h6">
              Пожалуйста, проверьте корректность ответов
            </Typography>
          </ModalContent>
        </>
      );
    }

    case 301: {
      return (
        <>
          <ModalHeader>
            <div css={modalHeaderWrapperCss}>
              <span>Завершить?</span>
            </div>
          </ModalHeader>
          <ModalContent>
            <div style={{ display: "flex", gap: "20px" }}>
              <Button
                key="complete"
                variant="contained"
                onClick={() => {
                  completeSurvey();
                  closeModal();
                }}
              >
                Да
              </Button>
              <Button
                key="continue"
                variant="contained"
                onClick={() => {
                  closeModal();
                }}
              >
                Нет
              </Button>
            </div>
          </ModalContent>
        </>
      );
    }
    case 302: {
      return (
        <>
          <ModalHeader>
            <div css={modalHeaderWrapperCss}>
              <span>Отмена</span>
            </div>
          </ModalHeader>
          <ModalContent>
            <Typography variant="h6">
              Пожалуйста, ответьте на все обязательные вопросы
            </Typography>
            <div css={buttonsWrapperCss}>
              <Button
                key="to_question"
                variant="outlined"
                onClick={() => {
                  goToQuesions();
                }}
              >
                К вопросам
              </Button>
              <Button
                key="continue"
                variant="contained"
                onClick={() => {
                  closeModal();
                }}
              >
                Закрыть
              </Button>
            </div>
          </ModalContent>
        </>
      );
    }

    case 303: {
      return (
        <>
          <ModalHeader>
            <div css={modalHeaderWrapperCss}>
              <span>Отмена</span>
            </div>
          </ModalHeader>
          <ModalContent>
            <Typography variant="h6">
              Пожалуйста, проверьте корректность ответов
            </Typography>
            <div style={{ display: "flex", gap: "20px" }}>
              <Button
                key="continue"
                variant="contained"
                onClick={() => {
                  closeModal();
                }}
              >
                К вопросам
              </Button>
              <Button
                key="continue"
                variant="contained"
                onClick={() => {
                  closeModal();
                }}
              >
                Закрыть
              </Button>
            </div>
          </ModalContent>
        </>
      );
    }
    case 401: {
      return null;
    }
  }
};

const mapStateToProps = (state: IState) => {
  const { modalMessage } = state;
  return { modalMessage };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    startSurvey: () => dispatch({ type: SAGA_START_AGAIN }),
    continueSurvey: () => dispatch({ type: START_SURVEY, isContinue: true }),
    completeSurvey: () => dispatch({ type: COMPLETE_SURVEY }),
    goToQuesions: () => dispatch(goToFirstDeviationPage()),
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(ModalContentComponent);
