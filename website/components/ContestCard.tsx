import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Countdown, { zeroPad } from "react-countdown";
import Router from "next/router";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: "0 auto",
  },
  media: {
    height: 140,
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
        <div>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              // image={props.contestInfo.contest_image}
              image="https://mdbootstrap.com/img/Photos/Slides/img%20(68).jpg"
              title="Contemplative Reptile"
            />
            <CardContent>
              <div>
                <Typography gutterBottom variant="h5" component="h2">
                  {props.contestInfo.contest_name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  <p>{props.contestInfo.start} <br /> {props.contestInfo.end}</p>
                </Typography></div>

            </CardContent>
          </CardActionArea>
          <CardActions>
            <tr>
              <td>
                <Button size="small" color="primary"
                  onClick={() => {
                    if (!localStorage.token) {
                      Router.push("/login")
                    }
                    else {
                      localStorage.setItem("code", props.contestInfo.contest_code);
                      localStorage.setItem("start", props.contestInfo.start_time);
                      localStorage.setItem("end", props.contestInfo.end_time);
                      Router.push("/question");
                    }
                  }}>
                  Enter Contest
        </Button></td><td style={{ paddingLeft: '50px' }}>
                <Countdown
                  date={new Date(props.contestInfo.timestamp)}
                  intervalDelay={1}
                  renderer={renderer}
                /></td>
            </tr>
          </CardActions>
        </div>
      ) : (<div>loading</div>)}
    </Card>

  );
}
