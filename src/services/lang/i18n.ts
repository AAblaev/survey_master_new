import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./ru.json";
import en from "./en.json";

import { store } from "../../store/store";

// console.log("store", store.getState());
// const culture = language ? language.culture : navigator.language;
const culture = "en";

i18n.use(initReactI18next).init({
	resources: {
		ru: {
			translation: ru,
		},
		en: {
			translation: en,
		},
	},
	lng: culture,
	fallbackLng: "en",
});

export default i18n;

// "errorIntMessage": "",
// 	"errorFloatMessage": "",
// 	"errorLimitedMessage": "",
// 	"errorLimitedValueMessage": "",
// 	"errorLimitDateMessage": "",
// 	"errorAllRowsMessage": "",
// 	"errorMinRowsMessage": "",
// 	"errorAllColumnsAllRowsMessage": "",
// 	"errorMinOneRowsMessage": "",
// 	"errorMinAllRowsMessage": "",
// 	"errorAllColumnsMessage": "",
// 	"checkUpMessage": ""
