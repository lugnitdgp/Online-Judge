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
    leasttime: 0,
    list: [],
  };
  componentDidMount() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contests`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        var least = 0;
        res.map((contest) => {
          if (least == 0 || contest["start_time"] < least)
            least = contest["start_time"]

          var dateObj = new Date((contest["start_time"] - 19800) * 1000);


          contest["start"] = dateObj.toString()
          contest["start"] = contest["start"].substring()
          dateObj = new Date((contest["end_time"] - 19800) * 1000);

          contest['end'] = dateObj.toString()
          console.log(contest)
        });
        this.setState({ list: res });
        this.setState({ leasttime: least });

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
            }}zz
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
                        localStorage.setItem("start", item.start_time);
                        localStorage.setItem("end", item.end_time);
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
                      {item.start} - {item.end}
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
