import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Desktop from "./Desktop";
import { store } from "./store/store";
import { MuiThemeProvider } from "@material-ui/core/styles";
import mainTheme from "./mui-theme";

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={mainTheme}>
      <Desktop />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
