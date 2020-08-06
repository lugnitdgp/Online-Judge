import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import red from "@material-ui/core/colors/red";

// Create a theme instance.
const theme = createMuiTheme({
  typography: {
    fontFamily: ["Quicksand"].join(","),
  },
  palette: {
    primary: {
      main: "#104E8B",
    },
    secondary: {
      main: "#104E8B",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#FFF",
    },
  },
});

export default theme;
