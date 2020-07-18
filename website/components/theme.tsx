import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import red from "@material-ui/core/colors/red";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4455dd",
    },
    secondary: {
      main: "#3344ff",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#eeeeff",
    },
  }

});

export default theme;
