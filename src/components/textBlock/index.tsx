import React from "react";
import { connect } from "react-redux";
import { IQuestion, IState } from "../../types";
import { visibleChecking } from "../../utils/rule-utils";
import { cardCss, titleTextCss } from "../questions/sc";

export type ITextBlockProps = {
  key: number;
  question: IQuestion;
};
export type StateProps = ReturnType<typeof mapStateToProps>;
type IOwnTextProps = StateProps & ITextBlockProps;

const TextBlock: React.FC<IOwnTextProps> = ({ question, isVisible }) => {
  const { hasComment, comment, config, docID } = question;
  if (!isVisible) {
    return null;
  }
  return (
    <div css={cardCss(true)}>
      <div css={titleTextCss(false)}>
        {(hasComment || config.dataType === "textblock") && (
          <div
            dangerouslySetInnerHTML={{ __html: comment ? comment + docID : "" }}
          ></div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState, props: ITextBlockProps) => {
  const { userAnswers, visiblityRulesDict } = state;
  const { question } = props;
  const { docID } = question;
  const isVisilbe = visibleChecking(
    userAnswers,
    visiblityRulesDict[String(docID)]
  );

  return {
    isVisible: isVisilbe,
  };
};

export default connect(mapStateToProps)(TextBlock);
