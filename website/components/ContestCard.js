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
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="https://mdbootstrap.com/img/Photos/Slides/img%20(68).jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            CodeCracker
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Enter Contest
        </Button>
        <Countdown
          date={new Date(props.time)}
          intervalDelay={1}
          renderer={renderer}
        />
      </CardActions>
    </Card>
  );
}
