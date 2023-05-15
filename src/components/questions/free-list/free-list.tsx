import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { setAnswer } from "../../../services/redux/actions";
import { IOption, IQuestion, IState } from "../../../types";
import { selectQuestionCss } from "../sc";
import {
  Chip,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Theme,
} from "@material-ui/core";
import { css } from "@emotion/react";
import { ICommonQuestionProps } from "../common-question.types";

type IStateProps = ReturnType<typeof mapStateToProps>;
type IDispatchProps = ReturnType<typeof mapDispathToProps>;

type IFreeListProps = IStateProps & IDispatchProps & ICommonQuestionProps;

export const formControlCss = css`
  width: 100%;
`;

const FreeList: React.FC<IFreeListProps> = ({
  currentQuestionIndex,
  question,
  setAnswer,
  userAnswer,
}) => {
  const { docID, title, config } = question;
  const options = config.options!;

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
          value={userAnswer}
          onChange={handleChange}
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

const mapStateToProps = (state: IState, props: ICommonQuestionProps) => {
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

export default connect(mapStateToProps, mapDispathToProps)(FreeList);
