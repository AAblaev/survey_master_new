import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { MuiThemeProvider } from "@material-ui/core/styles";
import mainTheme from "./mui-theme";
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={mainTheme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
