import React, { useState } from "react";
import { Typography, Button } from "@material-ui/core";
import Layout from "../components/layout";
import Grid from "@material-ui/core/Grid";
import ContestCard from "../components/contestCard";
import Router from "next/router";
import Loader from "../components/loading";
import { useMediaQuery } from "react-responsive";
import { useEffect, useContext } from "react";
import {AdminContext} from "../components/AdminContextProvider"; 
//Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getContest } from "../store/actions/contestAction";
import Footer from "components/footer";

//ALL CSS INJECTED FROM "main.css"
interface State {
  accesscode: string;
  provider: string;
}

export default function IndexPage() {
  //@ts-ignore
  const { storeAdmin } = useContext(AdminContext);
  const dispatch = useDispatch();
  const { contests } = useSelector((state) => state.contestReducer);
  const { loaded } = useSelector((state) => state.contestReducer);
  const [values, setValues] = React.useState<State>({
    accesscode: '',
    provider: '',
  });

  useEffect(() => {
    dispatch(getContest());
  }, []);

  useEffect(() => {
    let params = new URLSearchParams(document.location.search.substring(1));
    let code = params.get("code");
    if(localStorage.admin != null){
      storeAdmin(localStorage.admin == 'true');
      localStorage.removeItem("admin");
    }
    if (code) {
      var payload = JSON.stringify({
        accesscode: code,
        provider: "github"
      })
  
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/social_login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
          },
            body: payload
          }).then((resp) => resp.json())
          
        .then((response) => {
            localStorage.token = response.token;
            document.cookie = `token=${response.token}; path=/; max-age=${
                60 * 60 * 24 * 100
                }`;
            localStorage.onlinejudge_info = JSON.stringify({
                name: response.user.name,
                email: response.user.email,
                image_link: response.user.image_link
            });
            localStorage.admin = response.admin;
            window.location.href = "/";
        })
        .catch((e) => {
            console.log(e);
            
        });
    }
  }, [])

  

  const [loadedState, setLoaded] = useState(false);
  const [contestsTotal, setContests] = useState([]);

  if (
    JSON.stringify(contests) !== JSON.stringify(contestsTotal) ||
    loadedState != loaded
  ) {
    setContests(contests);
    setLoaded(loaded);
  }

  //const isTabletOrMobile = () => useMediaQuery({ query: "(max-width: 800px)" });
  const isDesktopOrLaptop = () =>
    useMediaQuery({ query: "(min-width: 801px)" });

  return (
    <>
      {isDesktopOrLaptop && (
        <Layout>
          {localStorage.onlinejudge_info ? (
            <>
              {loadedState ? (
                <>
                  <Grid container spacing={0} className="contestMainrow">
                    <Grid item xs={12} md={3} className="ContestSectionHead">
                      Ongoing
                      <br /> Contests
                    </Grid>
                    <Grid item xs={12} md={9} className="ContestGrid2">
                      {contestsTotal[0].length > 0 ? (
                        <>
                          {contestsTotal[0].map((res) => (
                            <div className="horizontalscroll">
                              <ContestCard contestInfo={res} />
                            </div>
                          ))}
                        </>
                      ) : (
                        <Typography className="noContestResponse">
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
                      {contestsTotal[1].length > 0 ? (
                        <>
                          {contestsTotal[1].map((res) => (
                            <div className="horizontalscroll">
                              <ContestCard contestInfo={res} />
                            </div>
                          ))}
                        </>
                      ) : (
                        <Typography className="noContestResponse">
                          There are no upcoming contests as of now.
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
                      {contestsTotal[2].length > 0 ? (
                        <>
                          {contestsTotal[2].map((res) => (
                            <div className="horizontalscroll">
                              <ContestCard contestInfo={res} />
                            </div>
                          ))}
                        </>
                      ) : (
                        <Typography className="noContestResponse">
                          Nothing here yet!
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Footer />
                </>
              ) : (
                <Loader />
              )}
            </>
          ) : (
            <>
              <Grid container spacing={0}>
                <Grid item xs={12} md={7} style={{ textAlign: "center" }}>
                  <img src="/Code-typing-bro.png" alt="." className="bannerImage" />
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
                      "Hello to Online Judge presented to you by
                      GLUG, NIT Durgapur"
                    </i>
                  </h3>
                  <div className="buttonsparent">
                    <Typography className="enterIntoContests">
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
            </>
          )}
          <Footer />

        </Layout>
      )}
    </>
  );
}
