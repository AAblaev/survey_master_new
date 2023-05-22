import React from "react";

import { IPage } from "../../types";

import Question from "../questions";
import { css } from "@emotion/react";
import { Typography } from "@material-ui/core";
import { DEFAULT_BACKGROUND_COLOR } from "../../consts/const";
// import FreeQuestion from "../questions/free/free";
// import SelectQuestion from "../questions/select/Select";
// import DropDownQuestion from "../questions/dropdown/DropDown";
// import MultiDropDownQuestion from "../questions/multidropdown/MultiDropDown";
// import FreeList from "../questions/free-list/free-list";
// import Scale from "../questions/scale/scale";

// export type IPage = ConnectedProps<typeof connector>;

export type IPageProps = {
  page: IPage;
  pageIndex: number;
};
export const pageCss = css`
  background-color: ${DEFAULT_BACKGROUND_COLOR};
  display: flex;
  flex-direction: column;
  padding-right: 40px;
  padding-left: 40px;

  // Устройства Small (телефоны с горизонтальной ориентацией, 576 пикселей и выше)
  @media (min-width: 576px) {
    padding-right: 5%;
    padding-left: 5%;
  }

  // Устройства Medium (планшеты, 768 пикселей и выше)
  @media (min-width: 768px) {
    padding-right: 5%;
    padding-left: 5%;
  }

  // Устройства Large (настольные компьютеры, 992 пикселей и выше)
  @media (min-width: 992px) {
    padding-right: 15%;
    padding-left: 15%;
  }

  // Устройства X-Large (большие настольные компьютеры, 1200 пикселей и выше)
  @media (min-width: 1200px) {
    padding-right: 20%;
    padding-left: 20%;
  }

  // Устройства XX-Large (большие настольные компьютеры, 1400 пикселей и выше)
  @media (min-width: 1400px) {
    padding-right: 20%;
    padding-left: 20%;
  }
`;

export const questionListCss = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Page: React.FC<IPageProps> = ({ page, pageIndex }) => {
  const questions = page.questions ? page.questions : [];
  const title = page.title ? page.title : `Страница ${pageIndex + 1}`;

  return (
    <div css={pageCss}>
      <Typography>{title}</Typography>
      <div css={questionListCss}>
        {questions.map((q, index) => (
          <Question key={index} currentQuestionIndex={index} question={q} />
        ))}
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
