import React from "react";
import { Container, CircularProgress, Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import {} from "@material-ui/icons";
import axios from "axios";

const styles = createStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: theme.spacing(2),
  },
  error: {
    textAlign: "center",
  },
}));

interface Props {
  provider: string;
  code: string;
  classes: any;
}

interface State {
  error: boolean;
}

class LoginPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
    };
    this.googleLogin = this.googleLogin.bind(this);
  }

  googleLogin() {
    var self = this;
    axios
      .post("/api/login/google", {
        code: this.props.code,
      })
      .then((res) => {
        axios
          .post(`${process.env.BACKEND_URL}/account/login`, {
            id_token: res.data.id_token,
            provider: "google",
          })
          .then((response) => {
            // localStorage.token = response.data.token;
            // window.location.href = "/";
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
            self.setState({
              error: true,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        self.setState({
          error: true,
        });
      });
  }

  facebookLogin() {
    var self = this;
    axios
      .post("/api/login/facebook", {
        code: this.props.code,
      })
      .then((res) => {
        axios
          .post(`${process.env.BACKEND_URL}/login`, {
            access_token: res.data.access_token,
            provider: "facebook",
          })
          .then((response) => {
            localStorage.token = response.data.token;
            window.location.href = "/";
          })
          .catch((e) => {
            console.log(e);
            self.setState({
              error: true,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        self.setState({
          error: true,
        });
      });
  }

  componentDidMount() {
    if (this.props.provider == "google") this.googleLogin();
    else if (this.props.provider == "facebook") this.facebookLogin();
    else alert("Invalid login provider");
  }

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.root}>
        {this.state.error ? (
          <React.Fragment>
            <Typography className={classes.error} variant="h6" color="error">
              Something went wrong. Please try again. If the problem still
              exists, contact the administrator.
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <CircularProgress size={"4rem"} />
            <Typography variant="h6" className={classes.title}>
              Logging you in
            </Typography>
          </React.Fragment>
        )}
      </Container>
    );
  }
}

export async function getServerSideProps(context) {
  return {
    props: {
      provider: context.params.provider,
      code: context.query.code,
    },
  };
}

export default withStyles(styles)(LoginPage);
