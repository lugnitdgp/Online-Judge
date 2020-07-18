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
import Router from "next/router";
import { MDBCarousel, MDBCarouselCaption, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask } from
"mdbreact";

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
      </Grid>
        <div className={classes.carousel}>
          <MDBCarousel
      activeItem={1}
      length={1}
      showControls={true}
      showIndicators={true}
      className="z-depth-1"
    >
      <MDBCarouselInner >
      {this.state.list.map((item) => (
        <MDBCarouselItem itemId="1">
          <MDBView>
            <img
              className="d-block w-100"
              onClick={() => {
                if (!localStorage.token) {
                  Router.push("/login")
                }
                else {
                  localStorage.setItem("code", item.contest_code);
                  localStorage.setItem("start", item.start_time);
                  localStorage.setItem("end", item.end_time);
                  Router.push("/question");
                }}}
              src="https://mdbootstrap.com/img/Photos/Slides/img%20(68).jpg"
              alt="Second slide"
            />
          <MDBMask overlay="black-strong"/>
          </MDBView>
          <MDBCarouselCaption>
            <p><b>{item.contest_name}</b></p>
            <p>{item.start} - {item.end}</p>
          </MDBCarouselCaption>
        </MDBCarouselItem>
      ))}

      </MDBCarouselInner>
    </MDBCarousel>
    </div>
      </Layout>
    );
  }

}

export default withStyles(styles)(IndexPage);
