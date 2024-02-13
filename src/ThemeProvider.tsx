import React from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { getTheme } from "./mui-theme";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { IState } from "./types";
// import { MuiThemeProvider } from "@material-ui/core/styles";

export type IThemeProviderProps = ConnectedProps<typeof connector>;

const ThemeProvider: React.FC<IThemeProviderProps> = ({ children, theme }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

const mapStateToProps = (state: IState) => {
  const { styles } = state;
  const {
    globalStyle: {
      brandColor,
      background: { color: backgroundColor },
    },
  } = styles;
  const theme = getTheme(brandColor, backgroundColor);
  return { theme };
};

const mapDispathToProps = (_dispatch: Dispatch) => {
  return {};
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(ThemeProvider);
