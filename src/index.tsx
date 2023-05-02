import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Desktop from "./Desktop";
import { store } from "./store/store";

ReactDOM.render(
  <Provider store={store}>
    <Desktop />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
