import React from "react";
import Countdown, { zeroPad } from "react-countdown";
import { CardContent, Card } from "@material-ui/core";

export default function Timer(props) {
  console.log(props);
  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <span>
        <Card style={{ padding: "0px", margin: "0 auto" }} elevation={0}>
          <CardContent style={{ padding: "0px", margin: "0 auto" }}>
            <div
              style={{
                textAlign: "center",
                margin: "0 auto",
                padding: "0",
                fontFamily: "'Bree serif', sans-serif",
                color: "#104e8b",
                fontOpticalSizing: "auto",
              }}
            >
              <h4 style={{ margin: "0 auto", padding: "0" }}>
                {/* {props.message}{" "}
                {days + hours + minutes + seconds > 0 ? (
                  <div>
                    {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:
                    {zeroPad(seconds)}
                  </div>
                ) : (
                  <p> </p>
                )} */}
                {props.message} {zeroPad(days)}:{zeroPad(hours)}:
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
