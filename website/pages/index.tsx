import React from "react";
import { Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "../styles/IndexStyles";
import Layout from "../components/Layout";
import Grid from "@material-ui/core/Grid";
import ContestCard from "../components/ContestCard";
import Router from "next/router";

interface IProps {
  classes: any;
}

class IndexPage extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    ongoing: [],
    ended: [],
    upcoming: [],
  };
  componentDidMount() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contests`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((res) => {
        var ongoing = [];
        var upcoming = [];
        var ended = [];
        res.map((contest) => {
          console.log(contest);
          var dateObj = new Date(contest["start_time"] * 1000);
          contest["start"] = dateObj.toString();
          contest["start"] =
            contest["start"].substring(0, 10) +
            contest["start"].substring(15, 24);
          var today = Date.now();
          var dateo = new Date(today);
          console.log(dateObj.toString(), "   ", dateo.toString(), "  ");
          dateObj = new Date(contest["end_time"] * 1000);
          contest["end"] = dateObj.toString();
          contest["end"] =
            contest["end"].substring(0, 10) + contest["end"].substring(15, 24);
          console.log(contest["end"]);
          if (
            contest["start_time"] * 1000 < today &&
            contest["end_time"] * 1000 > today
          ) {
            contest["timestamp"] = contest["end_time"] * 1000;
            ongoing.push(contest);
          } else if (contest["start_time"] * 1000 > today) {
            contest["upcoming"] = true;
            contest["timestamp"] = contest["start_time"] * 1000;
            upcoming.push(contest);
          } else {
            contest["ended"]=true;
            ended.push(contest);
          }
        });
        this.setState({ ongoing: ongoing, upcoming: upcoming, ended: ended });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <Layout>
        {localStorage.onlinejudge_info ? (
          <>
            <Grid container spacing={0} className="contestMainrow">
              <Grid item xs={12} md={3} className="ContestSectionHead">
                Ongoing
                <br /> Contests
              </Grid>
              <Grid item xs={12} md={9} className="ContestGrid2">
                {this.state.ongoing.length > 0 ? (
                  <>
                    {this.state.ongoing.map((res) => (
                      <div className="horizontalscroll">
                        <ContestCard contestInfo={res} />
                      </div>
                    ))}
                  </>
                ) : (
                  <Typography
                    style={{
                      textAlign: "center",
                      textTransform: "uppercase",
                      fontSize: "30px",
                      margin: "0px",
                      color: "#005",
                      backgroundColor: "#fff",
                    }}
                  >
                    There are no ongoing contests right now.
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={0} className="contestMainrow">
              <Grid item xs={12} md={3} className="ContestSectionHead">
                Upcoming
                <br /> Contests
              </Grid>
              <Grid item xs={12} md={9} className="ContestGrid2">
                {this.state.upcoming.length > 0 ? (
                  <>
                    {this.state.upcoming.map((res) => (
                      <div className="horizontalscroll">
                        <ContestCard contestInfo={res} />
                      </div>
                    ))}
                  </>
                ) : (
                  <Typography
                    style={{
                      textAlign: "center",
                      textTransform: "uppercase",
                      fontSize: "30px",
                      margin: "0px",
                      color: "#005",
                      backgroundColor: "#fff",
                    }}
                  >
                    There are no ongoing contests right now.
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={0} className="contestMainrow">
              <Grid item xs={12} md={3} className="ContestSectionHead">
                Previous
                <br /> Contests
              </Grid>
              <Grid item xs={12} md={9} className="ContestGrid2">
                {this.state.ended.length > 0 ? (
                  <>
                    {this.state.ended.map((res) => (
                      <div className="horizontalscroll">
                        <ContestCard contestInfo={res} />
                      </div>
                    ))}
                  </>
                ) : (
                  <Typography
                    style={{
                      textAlign: "center",
                      textTransform: "uppercase",
                      fontSize: "30px",
                      margin: "0px",
                      color: "#005",
                      backgroundColor: "#fff",
                    }}
                  >
                    There are no ongoing contests right now.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Grid container spacing={0}>
              <Grid item xs={12} md={7} style={{ textAlign: "center" }}>
                <img
                  src="/Coding-bro.png"
                  alt="."
                  style={{
                    width: "100%",
                    padding: "0",
                    position: "relative",
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                className="ContestGrid"
                style={{ textAlign: "center" }}
              >
                <h3 className="welcometext">
                  <i>
                    "Hi there, welcome to Online Judge presented to you by
                    Gnu/Linux Users' Group, Nit Durgapur"
                  </i>
                </h3>
                <div className="buttonsparent">
                  <Typography
                    style={{
                      textAlign: "center",
                      fontSize: "37px",
                      margin: "20px auto",

                      color: "#104E8B",
                      fontWeight: "bold",
                      width: "100%",
                      backgroundColor: "#fff",
                    }}
                  >
                    Enter right into contests
                  </Typography>
                  <div className="buttonsWrapper">
                    <Button
                      variant="outlined"
                      className="loginbtn"
                      type="submit"
                      color="primary"
                      onClick={() => Router.push("/login")}
                    >
                      Login
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp; OR &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      variant="contained"
                      className="loginbtn"
                      type="submit"
                      color="primary"
                      onClick={() => Router.push("/login")}
                    >
                      Signup
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </>
        )}
      </Layout>
    );
  }
}

export default withStyles(styles)(IndexPage);
