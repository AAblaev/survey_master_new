import React from "react";
import { css } from "@emotion/react";
import { borderCss, contentCss, gridContainerCss } from "../sc";

type IErrorComponent = {
  message: string;
  backgroundColor: string;
};

const rootCss = css`
  padding: 200px;
  font-size: 1.2rem;
  font-weight: 400;
`;

export const errorMessageDict: { [key: string]: string } = {
  SurveyAlreadyCompleted:
    "Благодарим вас за проявленный интерес к нашему опросу. К сожалению, мы обнаружили, что ваш профиль уже участвовал в данном опросе. Ваши ответы учтены, и мы выражаем благодарность за ваше участие.",
  PrivateLinkAlreadyUsed:
    "Благодарим вас за проявленный интерес к нашему опросу. К сожалению, мы обнаружили, что ваш профиль уже участвовал в данном опросе. Ваши ответы учтены, и мы выражаем благодарность за ваше участие.",
  LinkDisabled:
    "Благодарим вас за интерес к нашему опросу. К сожалению, мы вынуждены сообщить, что данный опрос был заблокирован по каким-то техническим или организационным причинам, и в настоящее время мы не принимаем новые ответы.",
  NoCompletion4Uid:
    "Кажется, что ссылка, которую вы предоставили, неактивна или некорректна. Пожалуйста, убедитесь, что адрес введен правильно, и повторите попытку.",
  ForbidByIP:
    "Благодарим вас за проявленный интерес к нашему опросу. К сожалению, мы обнаружили, что ваш профиль уже участвовал в данном опросе. Ваши ответы учтены, и мы выражаем благодарность за ваше участие.",
};

const ErrorComponent: React.FC<IErrorComponent> = ({
  message,
  backgroundColor,
}) => {
  const title = errorMessageDict.hasOwnProperty(message)
    ? errorMessageDict[message]
    : message;

  return (
    <div css={contentCss}>
      <div css={gridContainerCss}>
        <div css={borderCss(backgroundColor)}></div>
        {title}
        <div css={borderCss(backgroundColor)}></div>
      </div>
    </div>
  );
};
export default ErrorComponent;
