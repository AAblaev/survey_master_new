import React from "react";
import { css } from "@emotion/react";

type IGreetingPageProps = {
  html: string;
};

const greetingPageCss = css`
  color: #000000;
  font-size: 1.2rem;
  font-weight: 300;
  margin: 20px;
`;

const GreetingPage: React.FC<IGreetingPageProps> = ({ html }) => {
  return (
    <div css={greetingPageCss}>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
};

export default GreetingPage;
