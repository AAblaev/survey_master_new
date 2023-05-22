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
  padding-top: 84px;

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

const GreetingPage: React.FC<IGreetingPageProps> = ({ html }) => {
  return (
    <div css={greetingPageCss}>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
};

export default GreetingPage;
