import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  hero: {
    backgroundColor: "#42a5f5",
    height: "100vh",
    width: "100vw",
    alignItems: "center",
  },
  image: {
    height: "500px",
  },
  content: {
    padding: theme.spacing(2),
    color: "white"
  },
  svg: {
      width: "100vw"
  }
}));

export default () => {
  const classes = styles();

  return (
    <React.Fragment>
      <Grid container justify="space-between" className={classes.hero}>
        <Grid item justify="center" md={6}>
          <div className={classes.content}>
            <Typography variant="h2" component="h2">
              Online Judge
            </Typography>
          </div>
        </Grid>
        <Grid item alignItems="flex-start" md={6}>
          <img src="/untitled2.svg" className={classes.image} />
        </Grid>
      </Grid>
      <Grid container>
        <img src="/wave.svg" className={classes.svg} />
      </Grid>
    </React.Fragment>
  );
};
