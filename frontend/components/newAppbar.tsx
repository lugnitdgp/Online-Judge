import React, { Component } from "react";
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
import Router from "next/router";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Popover from "@material-ui/core/Popover";

interface IProps {
  classes?: any;
}

class Newappbar extends Component<IProps, {}> {
  state = {
    drawerActivate: false,
    drawer: false,
    open: false,
  };
  constructor(props: Readonly<IProps>) {
    super(props);
    this.state = { drawerActivate: false, drawer: false, open: false };
    this.createDrawer = this.createDrawer.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
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

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  //Small Screens
  createDrawer() {
    // const { classes } = this.props;
    return (
      <div>
        <ModalElement state={this.state} handleClose={this.handleClose} />
        <AppBar position="static">
          <Toolbar>
            <Grid
              container
              direction="row"
              justify="space-between"
              // alignItems="Right"
            >
              <MenuIcon
                className="NAsideBarIcon"
                onClick={() => {
                  this.setState({ drawer: true });
                }}
              />

              <div
                // color="inherit"
                // variant="h3"
                className="NAtitle"
                // alignItems="Right"
                // style={{ textAlign: "Right" }}
              >
                Online Judge &nbsp;&nbsp;
                <img
                  src="/oj.png"
                  alt="."
                  style={{ width: "30px", borderRadius: "5px" }}
                />
              </div>
            </Grid>
          </Toolbar>
        </AppBar>

        <SwipeableDrawer
          style={{ zIndex: 9999 }}
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
            <List className="NAlist">
              {localStorage.onlinejudge_info ? (
                <ListItem key={3} button>
                  <Button color="inherit" onClick={() => Router.push("/")}>
                    Contests
                  </Button>
                </ListItem>
              ) : (
                <div></div>
              )}
              {localStorage.onlinejudge_info ? (
                <ListItem key={2} button>
                  <Button color="inherit" onClick={this.handleOpen}>
                    Announcements
                  </Button>
                </ListItem>
              ) : (
                <div></div>
              )}
              {localStorage.onlinejudge_info ? (
                <ListItem key={1} button>
                  <Button color="inherit" onClick={this.handleOpen}>
                    Rules
                  </Button>
                </ListItem>
              ) : (
                <div></div>
              )}
              {localStorage.onlinejudge_info ? (
                <ListItem key={5} button>
                  <Button
                    color="inherit"
                    onClick={() => {
                      fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/logout`,
                        {
                          method: "POST",
                          headers: {
                            Authorization: `Token ${localStorage.token}`,
                          },
                        }
                      ).then(() => {
                        localStorage.clear();
                        Router.push("/");
                      });
                    }}
                  >
                    Logout
                  </Button>
                </ListItem>
              ) : (
                <div></div>
              )}
              <ListItem key={4} button>
                {localStorage.onlinejudge_info ? (
                  <React.Fragment>
                    <Avatar
                      src={JSON.parse(localStorage.onlinejudge_info).image_link}
                    />
                    &nbsp;
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

  render() {
    return (
      <div>
        {this.state.drawerActivate ? (
          this.createDrawer()
        ) : (
          <DestroyDrawer
            open={this.state.open}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
          />
        )}
      </div>
    );
  }
}

function DestroyDrawer(props: any) {
  // const { classes } = this.props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <ModalElement {...props} />
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            className="NAtitle"
            onClick={() => Router.push("/")}
          >
            <img
              src="/oj.png"
              alt="."
              style={{ width: "45px", borderRadius: "5px" }}
            />
            &nbsp;&nbsp;&nbsp;Online Judge
          </Typography>

          {localStorage.onlinejudge_info ? (
            <Button color="inherit" onClick={() => props.handleOpen}>
              Announcements
            </Button>
          ) : (
            <div></div>
          )}
          {localStorage.onlinejudge_info ? (
            <Button color="inherit" onClick={() => props.handleOpen}>
              Rules
            </Button>
          ) : (
            <div></div>
          )}
          {localStorage.onlinejudge_info ? (
            <Button color="inherit" onClick={() => Router.push("/")}>
              Contests
            </Button>
          ) : (
            <div></div>
          )}

          {localStorage.onlinejudge_info ? (
            <React.Fragment>
              <Avatar
                onClick={handleClick}
                src={JSON.parse(localStorage.onlinejudge_info).image_link}
              />
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Button
                  color="inherit"
                  onClick={() => {
                    fetch(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/logout`,
                      {
                        method: "POST",
                        headers: {
                          Authorization: `Token ${localStorage.token}`,
                        },
                      }
                    ).then(() => {
                      localStorage.clear();
                      Router.push("/");
                    });
                  }}
                >
                  Logout
                </Button>
              </Popover>
              &nbsp;
              {/* {JSON.parse(localStorage.onlinejudge_info).email.split("@")[0]} */}
            </React.Fragment>
          ) : (
            <Button color="inherit" onClick={() => Router.push("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

function ModalElement(props: any) {
  // const { classes } = this.props;
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className="NAmodal"
      open={props.open}
      onClose={() => props.handleClose()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className="NApaper">
          <h2>Announcement/Rules</h2>
          <ul>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
            <li>
              Sample announcement or rule here. Sample announcement or rule
              here.
            </li>
          </ul>
        </div>
      </Fade>
    </Modal>
  );
}

// Newappbar.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default Newappbar;
