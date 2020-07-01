import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "../styles/IndexStyles";
import Layout from "../components/Layout";
import Carousel from 'react-bootstrap/Carousel'
import Router from "next/router";

interface IProps {
  classes: any;
}

class IndexPage extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    list: [],
  };
  componentDidMount() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contests`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        res.map((contest) => {
          var dateObj = new Date(contest["start_time"] * 1000);
          var year = dateObj.getFullYear();

          var month = dateObj.getMonth() + 1;

          var day = dateObj.getDate();

          var hours = dateObj.getUTCHours();

          var minutes = dateObj.getUTCMinutes();

          var seconds = dateObj.getUTCSeconds();

          var formattedTime =
            day.toString().padStart(2, "0") +
            "/" +
            month.toString().padStart(2, "0") +
            "/" +
            year.toString().padStart(2, "0") +
            "  " +
            hours.toString().padStart(2, "0") +
            ":" +
            minutes.toString().padStart(2, "0") +
            ":" +
            seconds.toString().padStart(2, "0");
          contest["start_time"] = formattedTime;
          dateObj = new Date(contest["end_time"] * 1000);
          year = dateObj.getFullYear();

          month = dateObj.getMonth() + 1;

          day = dateObj.getDate();
          hours = dateObj.getUTCHours();

          minutes = dateObj.getUTCMinutes();

          seconds = dateObj.getUTCSeconds();

          formattedTime =
            day.toString().padStart(2, "0") +
            "/" +
            month.toString().padStart(2, "0") +
            "/" +
            year.toString().padStart(2, "0") +
            "  " +
            hours.toString().padStart(2, "0") +
            ":" +
            minutes.toString().padStart(2, "0") +
            ":" +
            seconds.toString().padStart(2, "0");
          contest["end_time"] = formattedTime;
        });
        this.setState({ list: res });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  Item(props) {
    const img = `./img/${props.item.contest_code}.jpg`
    console.log(img)
    return (
      <div>
        {/* <Card elevation={0}>
          <img
            onClick={() => {
              localStorage.setItem("code", props.item.contest_code);
              Router.push("/question");
            }}
            className={props.classes.carousel}
            src={img}
          />
        </Card> */}
        <h2>{props.item.contest_name}</h2>
        <p>Contest timings</p>
        <h4>
          {props.item.start_time} to {props.item.end_time}
        </h4>
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Layout>

        <Grid container justify="center" alignItems="center" direction="column">
          <main className={classes.main}>
            <Card className={classes.card}>
              <CardHeader
                style={{ textAlign: "center" }}
                title="Welcome to OnlineJ"
              />
              <CardContent>
                <Typography style={{ textAlign: "center" }}>
                  A completely material-themed custom Competitive coding
                  platform made by the GNU/Linux User's Group, NIT Durgapur
                </Typography>
              </CardContent>
            </Card>
          </main>
          <Card style={{ textAlign: "center", marginBottom: "20px" }}>
            <CardHeader title="Current Contests" />
            <CardContent>
              <Carousel
                indicators={false}
              >{this.state.list.map((item) => (
                <Carousel.Item>
                  <img
                    onClick={() => {
                      if (!localStorage.token) {
                        Router.push("/login")
                      }
                      else {
                        localStorage.setItem("code", item.contest_code);
                        Router.push("/question");
                      }
                    }}
                    className={classes.carousel} src="https://i.ytimg.com/vi/J2HGH8LrblU/maxresdefault.jpg"
                    alt={item.contest_name}
                  />
                  <Card>
                    <h6>{item.contest_name}</h6>
                    <p>Contest timings</p>
                    <p>
                      {item.start_time} - {item.end_time}
                    </p>
                  </Card>

                </Carousel.Item>
              ))}

              </Carousel>

            </CardContent>
          </Card>
        </Grid>
      </Layout>
    );
  }
}

export default withStyles(styles)(IndexPage);
