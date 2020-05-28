import { Typography, AppBar, Toolbar, Button } from "@material-ui/core";
import {} from "@material-ui/icons";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Router from "next/router"

const useStyles = makeStyles((theme: Theme) => ({
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
        <Button color="inherit" onClick={() => Router.push("/submissions")}>Submissons</Button>
        <Button color="inherit" onClick={() => Router.push("/leaderboard")}>Leaderboard</Button>
        {/* <Button color="inherit" onClick={() => Router.push("/announcement")}>Announcement</Button> */}
        <Button color="inherit" onClick={() => Router.push("/question")}>Questions</Button>
        <Button color="inherit" onClick={() => Router.push("/login")}>Login</Button>
      </Toolbar>
    </AppBar>
  );
}
