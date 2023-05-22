import React, { useMemo } from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { ICommonQuestionProps } from "../common-question.types";
import { rootCss } from "./html-sc";

type IHtmlProps = ICommonQuestionProps;

const Html: React.FC<IHtmlProps> = ({ currentQuestionIndex, question }) => {
  const { title, comment } = question;
  const label = `${currentQuestionIndex + 1}. ${title}`;
  const markup = useMemo(
    () => ({
      __html: comment,
    }),
    [comment]
  );

  return (
    <FormControl css={rootCss}>
      <FormLabel component="legend">{label}</FormLabel>
      <div dangerouslySetInnerHTML={markup} />
    </FormControl>
  );
};

export default Html;
