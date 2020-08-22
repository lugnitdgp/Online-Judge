import React from "react";
import { Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "../styles/IndexStyles";
import Layout from "../components/layout";
import Grid from "@material-ui/core/Grid";
import ContestCard from "../components/contestCard";
import Router from "next/router";
import Loader from "../components/loading";
import { useMediaQuery } from "react-responsive";


//Redux imports
import { connect } from "react-redux";
import { getContest } from "../store/actions/contestAction"
import store from "../store";
import withRedux from "next-redux-wrapper";

interface IProps {
  classes: any;
  props:any;
}



class IndexPage extends React.Component<any, {}>  {
  state = {
    // gotData: true,
    ongoing: [],
    ended: [],
    upcoming: [],
    // loaded: false,
    
  };
  

  componentDidMount() {
    // fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contests`, {
    //   method: "GET",
    // })
    //   .then((resp) => resp.json())
    //   .then((res) => {

        // const {contests} = this.props;

        this.props.getContest();

        console.log(this.props)

        var ongoing = [];
        var upcoming = []
        var ended = [];
        this.props.contests.map((contest) => {
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
            contest["ended"] = true;
            ended.push(contest);
          }
        });
        this.setState({ ongoing: ongoing, upcoming: upcoming, ended: ended });
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
  }

  render() {
    const isTabletOrMobile = () => useMediaQuery({ query: "(max-width: 800px)" });
    const isDesktopOrLaptop = () => useMediaQuery({ query: "(min-width: 801px)" });

    return (
      <>
      {/* {isTabletOrMobile && (
        <>
        <Layout>
        {localStorage.onlinejudge_info ? (
          <>
          {this.state.loaded ?  
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
            <div className="Footer">
              &copy; Created and maintained by GNU/Linux Users' group, Nit
              Durgapur
            </div>
          </>
          : <Loader />}
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
                <h3 className="welcometext" style={{fontSize:"14px", margin:"20px auto", width:"70%"}}>
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
                      onClick={() => Router.push("/signup")}
                    >
                      Signup
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
            <div className="FooterFixed">
              &copy; Created and maintained by GNU/Linux Users' group, Nit
              Durgapur
            </div>
          </>
        )}
      </Layout>

        </>
      )} */}
      
      {isDesktopOrLaptop && (
      
      <Layout>
        {localStorage.onlinejudge_info ? (
          <>
          {this.props.loaded ?  
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
            <div className="Footer">
              &copy; Created and maintained by GNU/Linux Users' group, Nit
              Durgapur
            </div>
          </>
          : <Loader />}
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
                      onClick={() => Router.push("/signup")}
                    >
                      Signup
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
            <div className="FooterFixed">
              &copy; Created and maintained by GNU/Linux Users' group, Nit
              Durgapur
            </div>
          </>
        )}
      </Layout>
      )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    contests: state.contestReducer.contests,
    loaded: state.contestReducer.loaded,
    serverError: state.contestReducer.error,
  };
}

export default connect(mapStateToProps, {
  getContest,
}) (IndexPage);
