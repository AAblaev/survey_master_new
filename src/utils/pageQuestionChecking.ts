import { SUCCESS_CHECKING_RESULT } from "../consts/const";
import { IPage, IUserAnswer } from "../types";
import {
  requiredQuestionsHasAnswer,
  requiredQuestionsHasCorrectAnswer,
  requiredQuestionsHasFullAnswer,
} from "./questionIsDone";

const pageQuestionChecking = ({
  page,
  userAnswers,
  questionChecking,
}: {
  page: IPage;
  userAnswers: IUserAnswer;
  questionChecking: boolean;
}) => {
  if (!questionChecking) {
    return SUCCESS_CHECKING_RESULT;
  }
  if (!requiredQuestionsHasAnswer(page, userAnswers)) {
    // console.log("!requiredQuestionsHasAnswer");
    return {
      status: false,
      message: "NOT_ALL_REQUIRED_QUESTIONS_HAS_ANSWERS",
      modalMessage: {
        code: 201,
        type: "cancelTransition",
      },
    };
  }
  if (!requiredQuestionsHasCorrectAnswer(page, userAnswers)) {
    // console.log("!requiredQuestionsHasCorrectAnswer");

    return {
      status: false,
      message: "NOT_ALL_REQUIRED_QUESTIONS_HAS_CORRECT_ANSWERS",
      modalMessage: {
        code: 202,
        type: "cancelTransition",
      },
    };
  }
  if (!requiredQuestionsHasFullAnswer(page, userAnswers)) {
    // console.log("!requiredQuestionsHasFullAnswer");

    return {
      status: false,
      message: "NOT_ALL_REQUIRED_QUESTIONS_HAS_FULL_ANSWERS",
      modalMessage: {
        code: 202,
        type: "cancelTransition",
      },
    };
  }

  return SUCCESS_CHECKING_RESULT;
};

export default pageQuestionChecking;
