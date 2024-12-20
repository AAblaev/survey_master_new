import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FormControl from "@mui/material/FormControl";
import {
	setAnswer,
	setNeedScrolling,
	validation,
} from "../../services/redux/actions";
import {
	IAnswer,
	IDataType,
	ILanguage,
	IQuestion,
	ISimpleType,
	IState,
	IStyles,
} from "../../types";
import FreeView from "./views/free";
import FreeListView from "./views/free-list";
import DropDownView from "./views/dropDown";
import MultiDropDownView from "./views/multiDropDown";
import ScaleView from "./views/scale/scale";
import SelectView from "./views/select";
import MatrixView from "./views/matrix";
import { EXTRA_ANSWER } from "../../consts/const";
import Html from "./views/html";
import NothingCheckbox from "./parts/extra/nothingCheckbox";
import UnableCheckbox from "./parts/extra/unableCheckbox";
import OtherCheckbox from "./parts/extra/otherCheckbox";
import { getNeedCorrect } from "../../utils/questionIsDone";
import {
	cardCss,
	formControlCss,
	titleCountCss,
	titleCss,
	titleTextCss,
	commentCss,
	limitMessageCss,
	limitMessageWrapperCss,
} from "./sc";
import { visibleChecking } from "../../utils/rule-utils";
import { requiredRowsEndColumnsChecking } from "../../utils/validation";
import ExtraMessage from "../common/ExtraMessage";
import DatePicker from "./views/datePicker";
import DatePickerListView from "./views/datePicker-list";
import MultiSelectView from "./views/multiSelect";
import QuestionHeader from "./parts/header";
import FileUploader from "./views/uploader";

const viewDict = {
	free: FreeView,
	freelist: FreeListView,
	dropdown: DropDownView,
	multidropdown: MultiDropDownView,
	scale: ScaleView,
	select: SelectView,
	multiselect: MultiSelectView,
	html: Html,
	matrix: MatrixView,
	fileuploader: FileUploader,
};

export type IViewComponentProps = {
	currentQuestionIndex: number;
	question: IQuestion;
	setAnswer: (answer: IAnswer) => void;
	userAnswer: IAnswer;
	questionStyles: IStyles["componentsStyle"]["question"];
	locale: ILanguage;
};

type IViewComponent = React.FC<IViewComponentProps>;

type IGetViewComponent = (
	questionType: IDataType,
	simpleType: ISimpleType
) => IViewComponent;

const getViewComponent: IGetViewComponent = (questionType, simpleType) => {
	switch (questionType) {
		case "free": {
			if (simpleType === "datetime") return DatePicker;
			return FreeView;
		}
		case "freelist": {
			if (simpleType === "datetime") return DatePickerListView;
			return FreeListView;
		}
		case "dropdown": {
			return DropDownView;
		}
		case "multidropdown": {
			return MultiDropDownView;
		}
		case "scale": {
			return ScaleView;
		}
		case "select": {
			return SelectView;
		}
		case "multiselect": {
			return MultiSelectView;
		}
		case "html": {
			return Html;
		}
		case "matrix": {
			return MatrixView;
		}
		case "fileuploader": {
			return FileUploader;
		}

		default: {
			return FreeView;
		}
	}
};

export type OwnProps = {
	index: number;
	pageID: number;
	currentQuestionIndex: number;
	question: IQuestion;
	isGrouped: boolean;
};

export type StateProps = ReturnType<typeof mapStateToProps>;
export type DispatchProps = ReturnType<typeof mapDispathToProps>;
type IQuestionProps = StateProps & OwnProps & DispatchProps;

export const extraFilter = (
	userAnswer: IAnswer,
	omit?: keyof typeof EXTRA_ANSWER
): IAnswer => {
	const extraIdsArr = Object.values(EXTRA_ANSWER);
	return {
		questionID: userAnswer.questionID,
		values: userAnswer.values.filter(
			option =>
				!extraIdsArr.includes(option.optionID) ||
				(omit && option.optionID === EXTRA_ANSWER[omit])
		),
	};
};

const Question: React.FC<IQuestionProps> = ({
	currentQuestionIndex,
	question,
	userAnswer: answerWithExtra,
	setAnswer,
	validation,
	visitedPageDocIDList,
	selectedQuestion,
	setScrolling,
	pageID,
	isVisible,
	isLogicalValiditySuccess,
	questionStyles,
	isGrouped,
	locale,
}) => {
	const {
		docID,
		title,
		config,
		hasNothingAnswer,
		hasOtherAnswer,
		hasUnableAnswer,
		hasComment,
		comment,
		isRequired,
		difficultToAnswerPlaceholder,
		nothingPlaceholder,
		otherPlaceholder,
	} = question;
	const elementRef = useRef<any>(null);

	const [active, setActive] = useState(true);

	// const { isLimited, isLimitedValue, limit, limitValue } = config;
	const questionText = `<div>${title}${
		isRequired ? '<span style="color:red;">*</span>' : ""
	} `;
	// docID=${docID}</div>
	const hasExtra = hasNothingAnswer || hasOtherAnswer || hasUnableAnswer;
	const otherInAnswer = answerWithExtra?.values.some(
		v => v.optionID === EXTRA_ANSWER.OTHER
	);

	const questionType = config.dataType as keyof typeof viewDict;
	// const ViewComponent = viewDict[questionType];
	const ViewComponent = getViewComponent(questionType, config.simpleType);
	const isImplementedQuestionType = viewDict.hasOwnProperty(questionType);
	const needPadding =
		questionType === "freelist" ||
		questionType === "select" ||
		questionType === "multiselect" ||
		questionType === "html" ||
		questionType === "matrix" ||
		questionType === "fileuploader" ||
		!isImplementedQuestionType;

	const isInternalExtra =
		questionType === "dropdown" ||
		questionType === "multidropdown" ||
		questionType === "multiselect";

	const userAnswer =
		answerWithExtra && hasExtra
			? extraFilter(answerWithExtra)
			: answerWithExtra;

	const userAnswerForSelect =
		answerWithExtra && extraFilter(answerWithExtra, "OTHER");

	const disabled = Boolean(
		answerWithExtra &&
			Boolean(
				answerWithExtra.values.find(
					ans => (ans.optionID as number) === EXTRA_ANSWER.UNABLE
				)
			)
	);

	const isEmpty =
		!answerWithExtra ||
		answerWithExtra.values.length === 0 ||
		(questionType === "freelist" &&
			!answerWithExtra.values.some(v => v.value !== ""));

	const isFocused =
		!!answerWithExtra && answerWithExtra.values.some(v => v.isFocused);

	const isValid =
		!!answerWithExtra &&
		answerWithExtra.values.length > 0 &&
		!answerWithExtra.values.some(v => !v.validationResult.isValid);

	const isUnabled =
		!!answerWithExtra &&
		answerWithExtra.values.length > 0 &&
		answerWithExtra.values[0].optionID === -1;

	const isNothing =
		!!answerWithExtra &&
		answerWithExtra.values.length > 0 &&
		answerWithExtra.values[0].optionID === -2;

	const isOther =
		!!answerWithExtra &&
		answerWithExtra.values.length > 0 &&
		answerWithExtra.values[0].optionID === -3 &&
		answerWithExtra.values[0].value !== "";

	const hasExtraInAnswer = isUnabled || isNothing || isOther;

	const isReqRowAndColCheckSuccess = requiredRowsEndColumnsChecking(
		question,
		userAnswer?.values
	);

	const pageIsVisited = visitedPageDocIDList.includes(String(pageID));

	const needCorrect = getNeedCorrect(
		isRequired,
		isEmpty,
		isFocused,
		isValid,
		pageIsVisited,
		isLogicalValiditySuccess,
		isReqRowAndColCheckSuccess,
		hasExtraInAnswer
	);

	const userAnswerResult = isInternalExtra
		? (answerWithExtra as IAnswer)
		: (userAnswer as IAnswer);

	// const extraMessage = "";

	useEffect(() => {
		if (!isVisible && !isEmpty) {
			setAnswer({ questionID: docID, values: [] });
		}
	}, [isVisible]);

	useEffect(() => {
		// if (selectedQuestion && elementRef.current) {
		//   setTimeout(() => {
		//     elementRef.current.scrollIntoView({
		//       block: "start",
		//       behavior: "auto",
		//     });
		//     setScrolling(false);
		//   }, 0);
		// }
	}, [selectedQuestion]);
	if (!isVisible) return null;
	return (
		<div ref={selectedQuestion ? elementRef : null} id={`docID${docID}`}>
			<QuestionHeader
				isActive={active}
				needCorrect={needCorrect}
				isGrouped={isGrouped}
				questionStyles={questionStyles}
				questionText={questionText}
				disabled={disabled}
				setActive={() => setActive(true)}
			>
				{hasComment && (
					<div
						css={commentCss(disabled)}
						dangerouslySetInnerHTML={{ __html: comment as string }}
					></div>
				)}
				<ExtraMessage
					config={config}
					needCorrect={needCorrect}
					isReqRowAndColCheckSuccess={isReqRowAndColCheckSuccess}
				/>
			</QuestionHeader>

			<div
				css={cardCss(
					needPadding || Boolean(otherInAnswer),
					questionStyles.border.color,
					questionStyles.border.size,
					questionType === "free" && needCorrect,
					questionStyles.background?.color
				)}
			>
				<FormControl
					css={formControlCss({
						disabled,
						noBorderOnInput: questionType === "free",
						boderOnForm: questionType === "free" && needCorrect,
					})}
					focused={false}
				>
					{isImplementedQuestionType ? (
						<ViewComponent
							currentQuestionIndex={currentQuestionIndex}
							question={question}
							userAnswer={
								questionType === "select"
									? (userAnswerForSelect as IAnswer)
									: (userAnswerResult as IAnswer)
							}
							setAnswer={setAnswer}
							questionStyles={questionStyles}
							locale={locale}
						/>
					) : (
						<div>Данного типа вопроса нет {questionType}</div>
					)}
					{!isInternalExtra && hasOtherAnswer && (
						<OtherCheckbox
							userAnswer={answerWithExtra as IAnswer}
							setAnswer={setAnswer}
							questionID={question.docID}
							singleAnswer={true}
							otherPlaceholder={otherPlaceholder}
						/>
					)}
					{!isInternalExtra && hasNothingAnswer && (
						<NothingCheckbox
							userAnswer={answerWithExtra as IAnswer}
							setAnswer={setAnswer}
							questionID={question.docID}
							singleAnswer={true}
							nothingPlaceholder={nothingPlaceholder}
						/>
					)}
				</FormControl>
			</div>

			{hasUnableAnswer && (
				<UnableCheckbox
					userAnswer={answerWithExtra as IAnswer}
					setAnswer={setAnswer}
					questionID={question.docID}
					difficultToAnswerPlaceholder={difficultToAnswerPlaceholder}
				/>
			)}
		</div>
	);
};

const mapStateToProps = (state: IState, props: OwnProps) => {
	const {
		userAnswers,
		visitedPageDocIDList,
		location,
		needScrolling,
		visiblityRulesDict,
		logicalValidityCheckRuleDict,
		dependentQuestionsDict,
		styles,
		data,
	} = state;
	const {
		globalStyle: { brandColor },
		componentsStyle: { question: questionStyles },
	} = styles;
	const { question } = props;
	const { docID } = question;
	const { questionIndex } = location;
	const locale = data ? data.language : "ru";
	const isVisilbe = visibleChecking(
		userAnswers,
		visiblityRulesDict[String(docID)]
	);

	const checkingResultArr = dependentQuestionsDict[String(docID)]
		? dependentQuestionsDict[String(docID)].map(ruleDocID => {
				// console.log(logicalValidityCheckRuleDict[ruleDocID]);

				return logicalValidityCheckRuleDict[ruleDocID].status;
		  })
		: [];

	const isLogicalValiditySuccess = checkingResultArr.every(status => status);

	return {
		userAnswer: userAnswers[docID] ? userAnswers[docID] : null,
		visitedPageDocIDList,
		selectedQuestion: needScrolling && questionIndex === props.index,
		isVisible: isVisilbe,
		isLogicalValiditySuccess,
		brandColor,
		questionStyles,
		locale,
	};
};

const mapDispathToProps = (dispatch: Dispatch) => {
	return {
		setScrolling: (value: boolean) => dispatch(setNeedScrolling(value)),
		setAnswer: (answer: IAnswer) => dispatch(setAnswer(answer)),
		validation: (question: IQuestion, optionID?: string) =>
			dispatch(validation({ question, optionID })),
	};
};

export default connect(mapStateToProps, mapDispathToProps)(Question);
