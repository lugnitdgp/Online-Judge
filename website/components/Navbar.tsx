import { Typography, AppBar, Toolbar, Button, Avatar } from "@material-ui/core";
import {} from "@material-ui/icons";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Router from "next/router";
import React from "react";

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
        <Button color="inherit" onClick={() => Router.push("/submissions")}>
          Submissons
        </Button>
        <Button color="inherit" onClick={() => Router.push("/leaderboard")}>
          Leaderboard
        </Button>
        {/* <Button color="inherit" onClick={() => Router.push("/announcement")}>Announcement</Button> */}
        <Button color="inherit" onClick={() => Router.push("/question")}>
          Questions
        </Button>
        {localStorage.onlinejudge_info ? (
          <React.Fragment>
            <Avatar
              src={JSON.parse(localStorage.onlinejudge_info).image_link}
            />
            &nbsp;{JSON.parse(localStorage.onlinejudge_info).name.split("@")[0]}
          </React.Fragment>
        ) : (
          <Button color="inherit" onClick={() => Router.push("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
