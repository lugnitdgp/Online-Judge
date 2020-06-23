import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  Grid,
  SwipeableDrawer,
  Button,
  Avatar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles, withStyles, Theme } from "@material-ui/core/styles";
import Router from "next/router";

const styleSheet = {
  list: {
    width: 200,
  },
  padding: {
    paddingRight: 30,
    cursor: "pointer",
  },

  sideBarIcon: {
    padding: 0,
    color: "white",
    cursor: "pointer",
  },
  menuButton: {
    marginRight: "10px",
  },
  title: {
    flexGrow: 1,
  },
};

class Newappbar extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerActivate: false, drawer: false };
    this.createDrawer = this.createDrawer.bind(this);
    this.destroyDrawer = this.destroyDrawer.bind(this);
  }

  componentWillMount() {
    if (window.innerWidth <= 600) {
      this.setState({ drawerActivate: true });
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 600) {
        this.setState({ drawerActivate: true });
      } else {
        this.setState({ drawerActivate: false });
      }
    });
  }

  //Small Screens
  createDrawer() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="Right"
            >
              <MenuIcon
                className={this.props.classes.sideBarIcon}
                onClick={() => {
                  this.setState({ drawer: true });
                }}
              />

              <Typography color="inherit" variant="headline">
                Online Judge
              </Typography>
            </Grid>
          </Toolbar>
        </AppBar>

        <SwipeableDrawer
          open={this.state.drawer}
          onClose={() => {
            this.setState({ drawer: false });
          }}
          onOpen={() => {
            this.setState({ drawer: true });
          }}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => {
              this.setState({ drawer: false });
            }}
            onKeyDown={() => {
              this.setState({ drawer: false });
            }}
          >
            <List className={this.props.classes.list}>
              <ListItem key={1} button divider>
                <Button
                  color="inherit"
                  onClick={() => Router.push("/submissions")}
                >
                  Submissons
                </Button>
              </ListItem>
              <ListItem key={2} button divider>
                <Button
                  color="inherit"
                  onClick={() => Router.push("/leaderboard")}
                >
                  Leaderboard
                </Button>
              </ListItem>
              <ListItem key={3} button divider>
                <Button
                  color="inherit"
                  onClick={() => Router.push("/question")}
                >
                  Questions
                </Button>
              </ListItem>
              <ListItem key={4} button divider>
                {localStorage.onlinejudge_info ? (
                  <React.Fragment>
                    <Avatar
                      src={JSON.parse(localStorage.onlinejudge_info).image_link}
                    />
                    &nbsp;
                    {
                      JSON.parse(localStorage.onlinejudge_info).name.split(
                        "@"
                      )[0]
                    }
                  </React.Fragment>
                ) : (
                  <Button color="inherit" onClick={() => Router.push("/login")}>
                    Login
                  </Button>
                )}
              </ListItem>
            </List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  //Larger Screens
  destroyDrawer() {
    const { classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() => Router.push("/")}
          >
            Online Judge
          </Typography>

          <Button color="inherit" onClick={() => Router.push("/submissions")}>
            Submissons
          </Button>
          <Button color="inherit" onClick={() => Router.push("/leaderboard")}>
            Leaderboard
          </Button>
          {/* <Button color="inherit" onClick={() => Router.push("/announcement")}>Announcement</Button> */}
          <Button color="inherit" onClick={() => Router.push("/question")}>
            Questions
          </Button>
          {localStorage.onlinejudge_info ? (
            <React.Fragment>
              <Avatar
                src={JSON.parse(localStorage.onlinejudge_info).image_link}
              />
              &nbsp;
              {JSON.parse(localStorage.onlinejudge_info).name.split("@")[0]}
            </React.Fragment>
          ) : (
            <Button color="inherit" onClick={() => Router.push("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  }

  render() {
    return (
      <div>
        {this.state.drawerActivate ? this.createDrawer() : this.destroyDrawer()}
      </div>
    );
  }
}

Newappbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Newappbar);
