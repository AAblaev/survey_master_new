import React from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { IState } from "../../types";
import { Dispatch } from "redux";
import { css } from "@emotion/react";
import ProgressLinear from "../common/ProgressLinear";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Progress } from "antd";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import { DEFAULT_STROKE } from "../../consts/const";
import { changeCurretLocation } from "../../services/redux/actions";

type ISurvey = ConnectedProps<typeof connector>;

export const pageCss = css`
  background-color: #fff;
  padding-right: 40px;
  padding-left: 40px;
`;

export const accordionCss = css`
  width: 100%;
  & .MuiAccordionSummary-content {
    align-items: center;
    gap: 20px;
  }

  & .MuiAccordionDetails-root {
    display: flex;
    justify-content: space-between;
  }
`;

const Survey: React.FC<ISurvey> = ({ selectPage, pages }) => {
  return (
    <div css={pageCss}>
      <ProgressLinear allQuestionCount={94} allQuestionsDoneCount={23} />
      <div>
        {pages.map((page, index) => {
          // const allQuestionCount = page.questions.length;
          // const doneQuestionCount = page.questions.filter(q =>
          // 	isQuestionDone(q)
          // ).length;
          // const requiredQuestionsCount = page.questions.filter(
          // 	q => q.config.isRequired
          // ).length;
          const allQuestionCount = 10;
          const doneQuestionCount = 7;
          const requiredQuestionsCount = 8;

          return (
            <Accordion
              key={index}
              defaultExpanded={true}
              disabled={false}
              css={accordionCss}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={String(page.docID)}
                id={String(page.docID)}
              >
                <Progress
                  type="circle"
                  width={50}
                  strokeColor={DEFAULT_STROKE}
                  percent={Math.floor(
                    (doneQuestionCount / allQuestionCount) * 100
                  )}
                />

                <Typography>страница {index + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <div className="questionSize">
                    <div className="question">Всего вопросов: </div>
                    <div className="questionNumber">{allQuestionCount}</div>
                  </div>
                  <div className="questionSize">
                    <div className="question">Обязательных вопросов: </div>
                    <div className="questionNumber">
                      {requiredQuestionsCount}
                    </div>
                  </div>
                </div>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    selectPage(index);
                  }}
                >
                  Перейти
                </Button>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  const pages = state.data ? state.data.pages : [];
  return {
    pages,
  };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    selectPage: (index: number) => {
      dispatch(
        changeCurretLocation({
          location: {
            pageIndex: index,
            pathName: "",
            questionIndex: 0,
            title: "page",
          },
          slideMoveDirection: "right-to-left",
        })
      );
    },
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(Survey);
