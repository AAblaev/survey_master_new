import React, { useMemo } from "react";
import { IViewComponentProps } from "..";

const Html: React.FC<IViewComponentProps> = ({ question }) => {
  const { comment } = question;
  const markup = useMemo(
    () => ({
      __html: comment ? comment : "",
    }),
    [comment]
  );

  return <div dangerouslySetInnerHTML={markup} />;
};

export default Html;
