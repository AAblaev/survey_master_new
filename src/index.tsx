import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import ThemeProvider from "./ThemeProvider";

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
