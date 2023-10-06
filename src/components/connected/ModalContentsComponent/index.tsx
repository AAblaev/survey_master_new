import React from "react";
import { Dispatch } from "redux";
import { Button, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { connect, ConnectedProps } from "react-redux";
import { ModalContent, ModalHeader } from "../../common/modal";
import { modalHeaderWrapperCss, onlyDesctopButtonCss } from "../../../sc";
import { buttonsWrapperCss } from "../../pages/sc";
import { IState } from "../../../types";
import { COMPLETE_SURVEY, START_SURVEY } from "../../../services/redux/types";

type IModalContentComponentProps = {
  closeModal: () => void;
};

export type IOwnModalContentComponentProps = IModalContentComponentProps &
  ConnectedProps<typeof connector>;

const ModalContentComponent: React.FC<IOwnModalContentComponentProps> = ({
  modalMessageType,
  closeModal,
  startSurvey,
  continueSurvey,
  completeSurvey,
}) => {
  switch (modalMessageType) {
    case "greeting": {
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
                  closeModal();
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
    case "cancelTransition": {
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

    case "completion": {
      return (
        <>
          <ModalHeader>
            <div css={modalHeaderWrapperCss}>
              <span>Поздравляем!</span>
              <IconButton onClick={() => closeModal()}>
                <CloseIcon />
              </IconButton>
            </div>
          </ModalHeader>
          <ModalContent>
            <Typography variant="h6">
              Вы успешно завершили этот опрос. Мы ценим ваше участие и ваши
              ответы помогут нам собрать ценные данные.
            </Typography>
            <Typography variant="h6">
              Спасибо, что уделили время для нас!
            </Typography>

            <div css={buttonsWrapperCss}>
              <Button
                key="continue"
                variant="contained"
                onClick={() => {
                  completeSurvey();
                  closeModal();
                }}
              >
                Завершить
              </Button>
            </div>
          </ModalContent>
        </>
      );
    }
  }
};

const mapStateToProps = (state: IState) => {
  const { modalMessageType } = state;
  return { modalMessageType };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    startSurvey: () => dispatch({ type: START_SURVEY, isContinue: false }),
    continueSurvey: () => dispatch({ type: START_SURVEY, isContinue: true }),
    completeSurvey: () => dispatch({ type: COMPLETE_SURVEY }),
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(ModalContentComponent);
