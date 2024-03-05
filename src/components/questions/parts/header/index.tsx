import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { IStyles } from "../../../../types";
import Timer from "../../../common/Timer";
import { cardCss, titleCountCss, titleCss, titleTextCss } from "../../sc";
import { btnWrapperCss } from "./sc";

type IQuestionHeaderProps = {
  isActive: boolean;
  setActive: () => void;
  questionText: string;
  isGrouped: boolean;
  disabled: boolean;
  needCorrect: boolean;
  questionStyles: IStyles["componentsStyle"]["question"];
};

const QuestionHeader: React.FC<IQuestionHeaderProps> = ({
  children,
  isActive,
  questionStyles,
  isGrouped,
  questionText,
  disabled,
  needCorrect,
  setActive,
}) => {
  if (!isActive) {
    return (
      <>
        <div css={titleCss(false)}>
          <div
            css={titleCountCss(
              questionStyles.counter.font.color,
              questionStyles.counter.font.size,
              isGrouped
            )}
          ></div>
        </div>
        <div
          css={cardCss(
            true,
            questionStyles.border.color,
            questionStyles.border.size,
            false
          )}
        >
          <div
            css={titleTextCss(
              false,
              questionStyles.title.font.color,
              questionStyles.title.font.size
            )}
          >
            Нажмите на кнопку для показа вопроса. Время доступности вопроса - 20
            секунд
          </div>
          <div css={btnWrapperCss}>
            <Button
              variant="contained"
              size="small"
              onClick={() => setActive()}
            >
              Показать вопрос
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div css={titleCss(disabled)}>
        <div
          css={titleCountCss(
            questionStyles.counter.font.color,
            questionStyles.counter.font.size,
            isGrouped
          )}
        ></div>
        <div
          css={titleTextCss(
            needCorrect,
            questionStyles.title.font.color,
            questionStyles.title.font.size
          )}
        >
          <div dangerouslySetInnerHTML={{ __html: questionText }}></div>
        </div>
        {false && (
          <div style={{ marginLeft: "auto" }}>
            <Timer
              limitTime={300}
              completeTimer={() => console.log("timer")}
              digitBlockStyle={{
                width: 20,
                height: 30,
                fontSize: 13,
                color: "red",
                backgroundColor: "white",
              }}
              separatorStyle={{
                size: 4,
                color: "red",
              }}
              dividerStyle={{
                height: 0,
              }}
            />
          </div>
        )}
      </div>
      {children}
    </>
  );
};

export default QuestionHeader;
