import React from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { IPage, IState } from "../../types";

import { css } from "@emotion/react";
import { Typography } from "@material-ui/core";
import FreeQuestion from "../questions/FreeQuestion";
import SelectQuestion from "../questions/SelectQuestion";
import DropDownQuestion from "../questions/DropDownQuestion";
import MultiDropDownQuestion from "../questions/MultiDropDownQuestion";
import FreeList from "../questions/free-list/free-list";

// export type IPage = ConnectedProps<typeof connector>;

export type IPageProps = {
  page: IPage;
  pageIndex: number;
};
export const pageCss = css`
  padding-right: 40px;
  padding-left: 40px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

export const questionWrapperCss = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 20px;
`;

const Page: React.FC<IPageProps> = ({ page, pageIndex }) => {
  const questions = page.questions ? page.questions : [];
  const title = page.title ? page.title : `Страница ${pageIndex + 1}`;

  return (
    <div css={pageCss}>
      <Typography>{title}</Typography>
      <div css={questionWrapperCss}>
        {questions.map((q, index) => {
          switch (q.config.dataType) {
            case "free": {
              return (
                <FreeQuestion
                  currentQuestionIndex={index}
                  question={q}
                  key={index}
                />
              );
            }

            case "freelist": {
              return (
                <FreeList
                  currentQuestionIndex={index}
                  question={q}
                  key={index}
                />
              );
            }

            case "dropdown": {
              return (
                <DropDownQuestion
                  currentQuestionIndex={index}
                  question={q}
                  key={index}
                />
              );
            }

            case "multidropdown": {
              return (
                <MultiDropDownQuestion
                  currentQuestionIndex={index}
                  question={q}
                  key={index}
                />
              );
            }

            case "select":
            case "multiselect": {
              return (
                <SelectQuestion
                  currentQuestionIndex={index}
                  question={q}
                  key={index}
                />
              );
            }

            default: {
              return (
                <div key={index}>
                  Данного типа вопроса нет {q.config.dataType}
                </div>
              );
            }
          }
        })}
      </div>
    </div>
  );
};

export default Page;

// const mapStateToProps = (state: IState) => {
//   const { location, data } = state;
//   const emptyData = !Boolean(data);
//   const pages = data ? data.pages : [];
//   const { pageIndex } = location;
//   const currentPage = pages[pageIndex];
//
//   return {
//     page: currentPage,
//     pageIndex,
//   };
// };
//
// const connector = connect(mapStateToProps);
//
// export default connector(Page);
