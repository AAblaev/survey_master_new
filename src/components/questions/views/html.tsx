import React, { useMemo } from "react";
import { ICommonQuestionProps } from "../common-question.types";

type IHtmlProps = ICommonQuestionProps & { [key: string]: any };

const Html: React.FC<IHtmlProps> = ({ question }) => {
  const { comment } = question;
  const markup = useMemo(
    () => ({
      __html: comment,
    }),
    [comment]
  );

  return <div dangerouslySetInnerHTML={markup} />;
};

export default Html;
