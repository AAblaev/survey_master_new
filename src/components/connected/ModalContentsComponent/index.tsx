import React from "react";
import { Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { modalHeaderWrapperCss, onlyDesctopButtonCss } from "../../../sc";
import { buttonsWrapperCss } from "../../pages/sc";
import { IState } from "../../../types";
import { COMPLETE_SURVEY, START_SURVEY } from "../../../services/redux/types";
import { ModalContent, ModalHeader } from "../../common/modal";

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
            <div>Хотите ли вы продолжить?</div>
            <div css={buttonsWrapperCss}>
              <Button
                key="start"
                variant="outlined"
                css={onlyDesctopButtonCss}
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
                css={onlyDesctopButtonCss}
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
            <div>Пожауйста, ответьте на обязательные вопросы</div>
          </ModalContent>
        </>
      );
    }

    case "completion": {
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
            <div>
              Поздравляем, вы ответили необходимое количество обязательных
              вопросов
            </div>
            <Button
              key="continue"
              variant="contained"
              css={onlyDesctopButtonCss}
              onClick={() => {
                completeSurvey();
                closeModal();
              }}
            >
              Завершить
            </Button>
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
