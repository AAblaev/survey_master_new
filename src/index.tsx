import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import ThemeProvider from "./ThemeProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./services/lang/i18n";

ReactDOM.render(
	<Provider store={store}>
		<ThemeProvider>
			<I18nextProvider i18n={i18n}>
				<App />
			</I18nextProvider>
		</ThemeProvider>
	</Provider>,
	document.getElementById("root") as HTMLElement
);
