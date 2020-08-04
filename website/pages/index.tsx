import React from "react";
import { Typography, Card } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "../styles/IndexStyles";
import Layout from "../components/Layout";
import Grid from "@material-ui/core/Grid";
import ContestCard from "../components/ContestCard";

interface IProps {
  classes: any;
}

class IndexPage extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    ongoing: [],
    ended:[],
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
        var ended =[];
        res.map((contest) => {
          console.log(contest)
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
            contest["timestamp"] = contest["end_time"] * 1000
            ongoing.push(contest)
          } else if (contest["start_time"] * 1000 > today) {
            contest["upcoming"]=true
            contest["timestamp"] = contest["start_time"] * 1000;
            upcoming.push(contest);
          }
          else{
              ended.push(contest)
          }
        });
        this.setState({ ongoing: ongoing, upcoming: upcoming, ended:ended});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <Layout>
        <Grid container spacing={3} style={{ height: "100vh" }}>
          <Grid
            item
            xs={12}
            md={9}
            style={{ margin: "0 auto", height: "100%" }}
          >
            <div
              style={{
                margin: "0 auto",
                width: "100%",
                height: "100%",
                backgroundColor: "#cbccff",
              }}
            >
              <div
                style={{
                  margin: "0 auto",
                  maxWidth: "1000px",

                  backgroundColor: "#cbccff",
                }}
              >
                <br />

                <Card
                  style={{
                    backgroundColor: "#fff",
                    width: "93%",
                    margin: "0 auto",
                  }}
                  elevation={4}
                >
                  <Typography
                    style={{
                      textAlign: "center",

                      fontSize: "30px",
                      margin: "0px",
                      color: "#005",
                      backgroundColor: "#fff",
                    }}
                  >
                    Ongoing Contests
                  </Typography>
                  {this.state.ongoing.length > 0 ? (
                    <Grid
                      container
                      spacing={3}
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "#fff",
                        paddingBottom: "50px",
                      }}
                    >
                      {this.state.ongoing.map((res) => (
                        <Grid item xs={12} style={{ margin: "0 auto" }}>
                          <ContestCard contestInfo={res} />
                        </Grid>
                      ))}
                    </Grid>
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
                </Card>
                <br />
                <Card
                  style={{
                    backgroundColor: "#fff",
                    width: "93%",
                    margin: "0 auto",
                  }}
                  elevation={4}
                >
                  <Typography
                    style={{
                      textAlign: "center",

                      fontSize: "30px",
                      margin: "0px",
                      color: "#005",
                      backgroundColor: "#fff",
                    }}
                  >
                    Upcoming Contests
                  </Typography>
                  {this.state.upcoming.length > 0 ? (
                    <Grid
                      container
                      spacing={3}
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "#fff",
                        paddingBottom: "50px",
                      }}
                    >
                      {this.state.upcoming.map((res) => (
                        <Grid item xs={12} style={{ margin: "0 auto" }}>
                          <ContestCard contestInfo={res} />
                        </Grid>
                      ))}
                    </Grid>
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
                      Keep watching this space!
                    </Typography>
                  )}
                </Card>
                <br />
                <Card
                  style={{
                    backgroundColor: "#fff",
                    width: "93%",
                    margin: "0 auto",
                  }}
                  elevation={4}
                >
                  <Typography
                    style={{
                      textAlign: "center",

                      fontSize: "30px",
                      margin: "0px",
                      color: "#005",
                      backgroundColor: "#fff",
                    }}
                  >
                    Already Finished Contests
                  </Typography>
                  {this.state.ended.length > 0 ? (
                    <Grid
                      container
                      spacing={3}
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        backgroundColor: "#fff",
                        paddingBottom: "50px",
                      }}
                    >
                      {this.state.ended.map((res) => (
                        <Grid item xs={12} style={{ margin: "0 auto" }}>
                          <ContestCard contestInfo={res} />
                        </Grid>
                      ))}
                    </Grid>
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
                      Keep watching this space!
                    </Typography>
                  )}
                </Card>
                <br/>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={3} style={{ margin: "0 auto" }}>
            <h3
              style={{
                fontSize: "20px",
                margin: "20px",
                color: "#005",
              }}
            >
              Announcement :
            </h3>
            <ul>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
            </ul>
            <br />
            <h3
              style={{
                fontSize: "20px",
                margin: "20px",
                color: "#005",
              }}
            >
              Playing Rules (Honor code) :
            </h3>
            <ul>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
              <li>Anouncemment 1 (sample announcement)</li>
            </ul>
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

export default withStyles(styles)(IndexPage);
