import { Typography, AppBar, Toolbar, Button } from "@material-ui/core";
import {} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Router from "next/router"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar({}) {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Online Judge
        </Typography>
        <Button color="inherit" onClick={() => Router.push("/login")}>Login</Button>
      </Toolbar>
    </AppBar>
  );
}
