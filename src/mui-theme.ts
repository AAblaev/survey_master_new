import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
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
      fontSize: "1rem",
    },
    body2: {
      color: "inherit",
      fontSize: "0.8rem",
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
        backgroundColor: "#46acaf",
        borderRadius: 0,
        color: "#fff",
        "&:hover": {
          backgroundColor: "#46acaf",
          color: "#fff",
        },
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: ".84rem",
      },
    },
  },
});

export default theme;
