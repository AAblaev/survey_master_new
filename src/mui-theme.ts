import { createTheme } from "@material-ui/core/styles";
import { PRIMARY_COLOR } from "./consts/const";

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Montserrat",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    body1: {
      color: "inherit",
      fontSize: "0.84rem",
    },
    body2: {
      color: "inherit",
      fontSize: "0.84rem",
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        color: "inherit",
      },
    },
    MuiSelect: {
      select: {
        backgroundColor: "#fff",
        "&:focus": {
          backgroundColor: "#fff",
        },
      },
    },
    MuiInputBase: {
      root: {
        color: "inherit",
        fontSize: ".84rem",
      },
    },
    MuiButton: {
      contained: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 0,
        color: "#fff",
        "&:hover": {
          backgroundColor: PRIMARY_COLOR,
          color: "#fff",
        },
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: ".84rem",
      },
    },
    MuiPopover: {
      root: {
        zIndex: "10000 !important" as any,
      },
    },
  },
});

export default theme;
