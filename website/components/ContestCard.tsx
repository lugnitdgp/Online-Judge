import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Countdown, { zeroPad } from "react-countdown";
import Router from "next/router";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  root: {
    Width: "90%",
    maxWidth: "700px",
    margin: "0 auto",
    padding: 0,
  },
  media: {
    height: 90,
    margin: "0 auto",
  },
});

export default function ContestCard(props) {
  const classes = useStyles();
  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <span>
        <div
          style={{
            textAlign: "center",
            margin: "0 auto",
            padding: "0",
            textTransform: "uppercase",
            fontFamily: "'Bree serif', sans-serif",
            color: "#005",
            fontOpticalSizing: "auto",
          }}
        >
          Time remaining
          <h5>
            {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:
            {zeroPad(seconds)}
          </h5>
        </div>
      </span>
    );
  };
  return (
    <Card className={classes.root}>
      {props.contestInfo ? (
        <Grid
          container
          spacing={3}
          style={{
            width: "100%",
            verticalAlign: "middle",
            margin: "0 auto",
            backgroundColor: "#eee",
            paddingBottom: "0px",
          }}
        >
          <Grid
            item
            xs={12}
            sm={4}
            style={{ margin: "0 auto", textAlign: "center" }}
          >
            <div>
              <img
                className={classes.media}
                // image={props.contestInfo.contest_image}
                src="https://mdbootstrap.com/img/Photos/Slides/img%20(68).jpg"
                title="Contemplative Reptile"
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={4} style={{ margin: "0 auto" }}>
            <div>
              <h4>{props.contestInfo.contest_name}</h4>
              <div color="textPrimary">
                <b>
                  <p>
                    {props.contestInfo.start} - {props.contestInfo.end}
                  </p>
                </b>
              </div>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            style={{ margin: "0 auto", textAlign: "center" }}
          >
            <Button
              size="large"
              color="primary"
              onClick={() => {
                if (!localStorage.token) {
                  Router.push("/login");
                } else {
                  localStorage.setItem("code", props.contestInfo.contest_code);
                  localStorage.setItem("start", props.contestInfo.start_time);
                  localStorage.setItem("end", props.contestInfo.end_time);
                  Router.push("/question");
                }
              }}
            >
              Enter Contest
            </Button>

            <Countdown
              date={new Date(props.contestInfo.timestamp)}
              intervalDelay={1}
              renderer={renderer}
            />
          </Grid>
        </Grid>
      ) : (
        <div>loading</div>
      )}
    </Card>
  );
}
