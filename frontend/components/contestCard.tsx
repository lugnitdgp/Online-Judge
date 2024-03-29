import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Countdown, { zeroPad } from "react-countdown";
import Router from "next/router";
import Grid from "@material-ui/core/Grid";
import { useContext } from "react";
import {AdminContext} from './AdminContextProvider';

const useStyles = makeStyles({
  root: {
    maxWidth: "300px",
    margin: "0 auto",
    padding: 0,
    borderTop: "10px solid #104E8B",
    borderBottom: "10px solid #104E8B",
    border: "2px solid #104E8B",
    borderRadius: "20px",
  },
  media: {
    width: "80%",
    margin: "0 auto",
  },
});

export default function ContestCard(props) {
  const classes = useStyles();
  const [hasEnded, setHasEnded] = React.useState(false);
  const { admin } = useContext(AdminContext);

  React.useEffect(() => {
    let t1 = new Date(props.contestInfo.end_time * 1000);
    let t2 = new Date();
    // t1.setYear(t2.getUTCFullYear());

    setHasEnded(t1.getTime() < t2.getTime());
  }, []);

  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <span>
        <div
          style={{
            textAlign: "center",
            margin: "0 auto",
            padding: "0",
            textTransform: "uppercase",
            color: "#104e8b",
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
    <Card className={classes.root} elevation={0}>
      {props.contestInfo ? (
        <Grid
          container
          spacing={3}
          style={{
            width: "100%",
            maxWidth: "300px",
            verticalAlign: "middle",
            margin: "0 auto",
            paddingBottom: "0px",
          }}
        >
          <Grid item xs={12} style={{ margin: "0 auto", textAlign: "center" }}>
            <div>
              <img
                className={classes.media}
                // image={props.contestInfo.contest_image}
                src={props.contestInfo?.contest_image}
                title={props.contestInfo?.contest_name}
                style={{ borderRadius: "10px" }}
              />
            </div>
          </Grid>
          <Grid item xs={12} style={{ margin: "0 auto" }}>
            <div style={{ textAlign: "center", color: "#104e8b" }}>
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
          <Grid item xs={12} style={{ margin: "0 auto", textAlign: "center" }}>
            
            {
              props.contestInfo.prize_link && !hasEnded ? 
              <Button
              size="large"
              color="primary"
              variant="outlined"
              style={{ outline: "none", border: "none" }}
              onClick={() => {
                if (!localStorage.token) {
                  Router.push("/login");
                } else {
                  Router.push(
                    `${props.contestInfo.prize_link}`,
                    `${props.contestInfo.prize_link}`
                  );
                }
              }}
            >
              Prize Eligibility Form
            </Button>
              :
              <></>
            }
            {props.contestInfo.upcoming ? (
              admin==true ? (
              <Button
                size="large"
                color="primary"
                variant="outlined"
                style={{ outline: "none", border: "none" }}
                onClick={() => {
                  if (!localStorage.token) {
                    Router.push("/login");
                  } else {
                    localStorage.setItem(
                      "code",
                      props.contestInfo.contest_code
                    );
                    localStorage.setItem("start", props.contestInfo.start_time);
                    localStorage.setItem("end", props.contestInfo.end_time);
                    Router.push(
                      "/[contest]",
                      `/${props.contestInfo.contest_code}`
                    );
                  }
                }}
              >
                Enter Contest
              </Button> 
  
              
              
              ) : <></>
            ) : (
              <Button
                size="large"
                color="primary"
                variant="outlined"
                style={{ outline: "none", border: "none" }}
                onClick={() => {
                  if (!localStorage.token) {
                    Router.push("/login");
                  } else {
                    localStorage.setItem(
                      "code",
                      props.contestInfo.contest_code
                    );
                    localStorage.setItem("start", props.contestInfo.start_time);
                    localStorage.setItem("end", props.contestInfo.end_time);
                    Router.push(
                      "/[contest]",
                      `/${props.contestInfo.contest_code}`
                    );
                  }
                }}
              >
                {hasEnded ? "Check Editorials" : "Enter Contest"}
              </Button>
            )}
            <br />
            {props.contestInfo.timestamp ? (
              <Countdown
                date={new Date(props.contestInfo.timestamp)}
                intervalDelay={1}
                renderer={renderer}
              />
            ) : null}
          </Grid>
        </Grid>
      ) : (
        <div>loading</div>
      )}
    </Card>
  );
}
