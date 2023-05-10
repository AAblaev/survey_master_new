import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { setAnswer } from "../../services/redux/actions";
import { IOption, IQuestion, IState } from "../../types";
import { selectQuestionCss } from "./sc";
import {
  Chip,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Theme,
} from "@material-ui/core";
import { css } from "@emotion/react";

type OwnProps = {
  key: number;
  currentQuestionIndex: number;
  question: IQuestion;
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispathToProps>;

type IFreeQuestionProps = StateProps & OwnProps & DispatchProps;

export const formControlCss = css`
  width: 100%;
`;

export const chipWrapperCss = css``;
export const chipCss = css``;

const MultiDropDownQuestion: React.FC<IFreeQuestionProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, title, pageID, surveyID, config } = question;
  const options = config.options!;
  const optionsDict = options.reduce(
    (res, option) => ({ ...res, [`${option.docID}`]: option }),
    {}
  ) as { [key: string]: IOption };

  const handleChange = (value: any) => {
    const newAnswer = value.target.value;
    setAnswer({
      docID: docID,
      value: newAnswer,
    });
  };

  return (
    <FormControl css={selectQuestionCss}>
      <FormLabel id={String(docID)} component="legend">
        {currentQuestionIndex + 1}. {title}
      </FormLabel>

      <FormControl variant="standard" css={formControlCss}>
        <Select
          multiple
          value={userAnswer}
          onChange={handleChange}
          renderValue={(items) => {
            const ids = items as number[];
            const options = ids.map((id: number) => optionsDict[id]);
            return (
              <div css={chipWrapperCss}>
                {options.map(({ docID, title }) => (
                  <Chip key={docID} label={title} css={chipCss} />
                ))}
              </div>
            );
          }}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            getContentAnchorEl: null,
          }}
        >
          {options.map((item) => (
            <MenuItem key={item.docID} value={item.docID}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FormControl>
  );
};

const mapStateToProps = (state: IState, props: OwnProps) => {
  const { userAnswers } = state;
  const { question } = props;
  const { docID } = question;
  return { userAnswer: userAnswers[docID] ? userAnswers[docID] : [] };
};

const mapDispathToProps = (dispatch: Dispatch) => {
  return {
    setAnswer: ({ docID, value }: { docID: number; value: any[] }) => {
      dispatch(setAnswer({ docID, value }));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(MultiDropDownQuestion);
