import React from "react";
import Countdown, { zeroPad } from "react-countdown";
import { CardContent, Card } from "@material-ui/core";

export default function Timer(props) {
  console.log(props);
  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <span>
        <Card style={{ padding: "0px", margin: "0 auto" }} elevation={0}>
          <CardContent>
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
              <h4>
                This contest ends in : {zeroPad(days)}:{zeroPad(hours)}:
                {zeroPad(minutes)}:{zeroPad(seconds)}
              </h4>
            </div>
          </CardContent>
        </Card>
      </span>
    );
  };

  return (
    <Countdown
      date={new Date(props.time)}
      intervalDelay={1}
      renderer={renderer}
    />
  );
}
