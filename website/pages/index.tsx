import React from "react";
import { Typography, Card, CardContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "../styles/IndexStyles";
import Layout from "../components/Layout";
import Grid from "@material-ui/core/Grid";
import ContestCard from "../components/ContestCard";
// import Router from "next/router";
// import {
//   MDBCarousel,
//   MDBCarouselCaption,
//   MDBCarouselInner,
//   MDBCarouselItem,
//   MDBView,
//   MDBMask,
// } from "mdbreact";

interface IProps {
  classes: any;
}

class IndexPage extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    ongoing: [],
    upcoming:[]
  };
  componentDidMount() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contests`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        var ongoing=[]
        var upcoming=[]
        res.map((contest) => {
          var dateObj = new Date((contest["start_time"] - 19800) * 1000);
          contest["start"] = dateObj.toString();
          var today=Date.now()
          dateObj = new Date((contest["end_time"] - 19800) * 1000);
          contest["end"] = dateObj.toString();
          if(((contest["start_time"]-19800)*1000) < today && ((contest["end_time"] - 19800) * 1000) > today){
            contest["timestamp"]=(contest["end_time"] - 19800) * 1000
            ongoing.push(contest)
          }
          else if(((contest["start_time"]-19800)*1000) > today){
            contest["timestamp"]=(contest["start_time"]-19800)*1000
            upcoming.push(contest)
          }
          console.log(contest);
        });
        this.setState({ ongoing:ongoing, upcoming:upcoming });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <Layout>
        {/* <div className={classes.carousel}>
          <MDBCarousel
            activeItem={1}
            length={total}
            showControls={true}
            showIndicators={true}
            //className="z-depth-1"
            style={{ margin: "0 auto", height: "auto", marginBottom: "0", padding: "0 auto", paddingBottom: "0" }}
          >
            <MDBCarouselInner style={{ margin: "0 auto", padding: "0 auto" }} >
              {this.state.list.map((item) => (
                <MDBCarouselItem itemId={item.num} style={{ margin: "0 auto" }}>
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
                        }
                      }}
                      src="https://mdbootstrap.com/img/Photos/Slides/img%20(68).jpg"
                      alt="Second slide"
                    />
                    <MDBMask overlay="black-strong" />
                  </MDBView>
                  <MDBCarouselCaption>
                    <p><b>{item.contest_name}</b></p>
                    <p>{item.start} - {item.end}</p>
                  </MDBCarouselCaption>
                </MDBCarouselItem>
              ))
              }

            </MDBCarouselInner>
          </MDBCarousel>
        </div> */}
        <div
          style={{
            margin: "0 auto",
            width: "100%",
            height:"100%",
            backgroundColor: "#cbccff",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: "1400px",

              backgroundColor: "#cbccff",
            }}
          >
            <Card
              style={{
                margin: "0 auto",
                maxWidth: "1400px",
                backgroundColor: "#cbccff",
              }}
              elevation={0}
            >
              <Typography
                style={{
                  textAlign: "center",
                  textTransform: "uppercase",
                  fontSize: "35px",
                  marginTop: "10px",
                  fontFamily: "'Bree serif', sans-serif",
                  color: "#005",
                }}
              >
                Welcome to Online Judge
              </Typography>
              <Typography
                style={{
                  textAlign: "center",
                  textTransform: "uppercase",
                  fontSize: "15px",
                  marginTop: "0px",
                  fontFamily: "'Bree serif', sans-serif",
                  color: "#005",
                }}
              >
                Presented to you by Gnu/Linux users' group, Nit durgapur
              </Typography>
              <CardContent>
                <Typography
                  style={{
                    textAlign: "center",
                    margin: "0 auto",
                    maxWidth: "700px",
                  }}
                >
                  A completely material-themed custom Competitive coding
                  platform made by the GNU/Linux User's Group, NIT Durgapur, A
                  completely material-themed custom Competitive coding platform
                  made by the GNU/Linux User's Group, NIT Durgapur, A completely
                  material-themed custom Competitive coding platform made by the
                  GNU/Linux User's Group, NIT Durgapur, A completely
                  material-themed custom Competitive coding platform made by the
                  GNU/Linux User's Group, NIT Durgapur
                </Typography>
              </CardContent>
            </Card>
            <Typography
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                fontSize: "30px",
                margin: "0px",
                fontFamily: "'Bree serif', sans-serif",
                color: "#005",
                backgroundColor: "#cbccff",
              }}
            >
              Ongoing contests
            </Typography>
            {this.state.ongoing.length > 0 ? (
            <Grid
              container
              spacing={3}
              style={{
                width: "100%",
                margin: "0 auto",
                backgroundColor: "#cbccff",
                paddingBottom: "50px",
              }}
            >
              {this.state.ongoing.map((res)=>(
                <Grid item xs={12} sm={6} md={4} lg={3}>
                <ContestCard contestInfo = {res}/>
              </Grid>
            ))}
            
            </Grid>
            ):(<Typography
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                fontSize: "30px",
                margin: "0px",
                fontFamily: "'Bree serif', sans-serif",
                color: "#005",
                backgroundColor: "#cbccff",
              }}
            >
             There are no ongoing contests right now.
            </Typography>)}
            <Typography
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                fontSize: "30px",
                margin: "0px",
                fontFamily: "'Bree serif', sans-serif",
                color: "#005",
                backgroundColor: "#cbccff",
              }}
            >
              Upcoming contests
            </Typography>
            {this.state.upcoming.length > 0 ? (
            <Grid
              container
              spacing={3}
              style={{
                width: "100%",
                margin: "0 auto",
                backgroundColor: "#cbccff",
                paddingBottom: "50px",
              }}
            >
              {this.state.upcoming.map((res)=>(
                <Grid item xs={12} sm={6} md={4} lg={3}>
                <ContestCard contestInfo = {res}/>
              </Grid>
            ))}
            
            </Grid>
            ):(<Typography
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                fontSize: "30px",
                margin: "0px",
                fontFamily: "'Bree serif', sans-serif",
                color: "#005",
                backgroundColor: "#cbccff",
              }}
            >
             Keep watching this space!
            </Typography>)}
          </div>
        </div>
      </Layout>
    );
  }
}

export default withStyles(styles)(IndexPage);
