import React from "react";
import { IQuestion } from "../../types";
import { cardCss, titleTextCss } from "../questions/sc";

export type ITextBlockProps = {
  key: number;
  question: IQuestion;
};

const TextBlock: React.FC<ITextBlockProps> = ({ question }) => {
  const { hasComment, comment, config } = question;
  return (
    <div css={cardCss(true)}>
      <div css={titleTextCss(false)}>
        {(hasComment || config.dataType === "textblock") && (
          <div
            dangerouslySetInnerHTML={{ __html: comment ? comment : "" }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default TextBlock;
