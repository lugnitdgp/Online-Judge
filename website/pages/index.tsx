import React from "react";
import { Grid, Typography } from "@material-ui/core";
import {} from "@material-ui/icons";
import { withStyles, createStyles } from "@material-ui/core/styles";
import Layout from "../components/Layout";

const styles = createStyles(() => ({
  "@global": {
    body: {
      backgroundColor: "black",
    },
  },
  "@keyframes move": {
    from: {
      transform: "translate(-50%, 200%)",
      opacity: 0,
    },
    to: {
      transform: "translate(-50%, -50%)",
      opacity: 1,
    },
  },
  hero: {
    position: "absolute",
    left: "50%",
    top: "50%",
    color: "red",
    transform: "translate(-50%, -50%)",
    animation: "$move 1s ease-in-out",
  },
}));

interface IProps {
  classes: any;
}

class IndexPage extends React.Component<IProps, {}> {
  render() {
    const { classes } = this.props;
    return (
      <Layout>
        <Grid container>
          <Typography variant="h2" className={classes.hero}>
            Next Material Template
          </Typography>
        </Grid>
      </Layout>
    );
  }
}

export default withStyles(styles)(IndexPage);
