import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Zoom } from "@material-ui/core";
import React from "react";
import { GetServerSideProps } from "next";
import { Facebook } from "@material-ui/icons";

const styles = createStyles((theme: Theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80)",
    backgroundRepeat: "no-repeat",
    backgroundColor: "grey",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: "0px 4px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
  },
  avatar: {
    margin: "10px",
    backgroundColor: "blue",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginBottom: "50px",
    padding: "20px",
  },
  signInIcon: {
    color: "white",
    marginRight: theme.spacing(1),
  },
  googleButton: {
    borderColor: "red",
    padding: theme.spacing(1),
    color: "red",
    marginBottom: theme.spacing(2),
  },
  facebookButton: {
    color: "white",
    backgroundColor: "#4267b2",
    "&:hover": {
      backgroundColor: "blue",
    },
    "@media screen and (max-width: 450px)": {
      fontSize: "0.9rem",
    },
  },
  linkedInButton: {
    backgroundColor: "#027bb6",
    marginTop: theme.spacing(2),
    color: "white",
    "&:hover": {
      backgroundColor: "blue",
    },
  },
  linkedInIcon: {
    marginRight: theme.spacing(1),
  },
}));

const googleLogin = () => {
  let url = new URL("https://accounts.google.com");
  url.pathname = "/o/oauth2/v2/auth";
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
  url.searchParams.set(
    "redirect_uri",
    `${window.location.protocol}//${window.location.host}/login/google`
  );
  url.searchParams.set("response_type", "code");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("scope", ["openid", "profile", "email"].join(" "));

  window.location.href = url.toString();
};

const facebookLogin = () => {
  let url = new URL("https://www.facebook.com/");
  url.pathname = "v6.0/dialog/oauth";
  url.searchParams.set(
    "redirect_uri",
    `${window.location.protocol}//${window.location.host}/login/facebook`
  );
  url.searchParams.set("client_id", process.env.FACEBOOK_CLIENT_ID);
  url.searchParams.set("scope", ["email"].join(","));
  window.location.href = url.toString();
};

// const linkedInLogin = () => {
//   // let url = new URL("https://www.linkedin.com");
//   // url.pathname = "/oauth/v2/authorization";
//   // url.searchParams.set(
//   //   "redirect_uri",
//   //   `${window.location.protocol}//${window.location.host}/api/authentication/linkedin`
//   // );
//   // url.searchParams.set("client_id", process.env.LINKEDIN_CLIENT_ID);
//   // url.searchParams.set("response_type", "code");
//   // url.searchParams.set(
//   //   "scope",
//   //   ["r_liteprofile", "r_emailaddress", "w_member_social"].join(" ")
//   // );

//   // window.location.href = url.toString();
//   window.location.href = `https://sosrgstudios.auth.ap-south-1.amazoncognito.com/login?client_id=d0nncoo9vge8bhqlbjr11tnnb&response_type=code&scope=email+openid+profile&redirect_uri=${window.location.protocol}//${window.location.host}/api/authentication/linkedin`;
// };

interface Props {
  classes: any;
}

interface State {}

class LoginPage extends React.Component<Props, State> {
  render() {
    const { classes } = this.props;

    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Zoom in timeout={500} style={{ transitionDelay: "500ms" }}>
            <div className={classes.paper}>
              <Avatar
                className={classes.avatar}
                src="https://img.icons8.com/officel/80/000000/court-judge.png"
              />
              <Typography component="h1" variant="h5">
                Login to Online judge
              </Typography>
              <Container className={classes.form}>
                <Typography color="error"></Typography>
                <Button
                  variant="outlined"
                  className={classes.googleButton}
                  size="large"
                  fullWidth
                  onClick={() => googleLogin()}
                >
                  <img
                    src="https://img.icons8.com/color/24/000000/google-logo.png"
                    className={classes.signInIcon}
                  />
                  Sign in with Google
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  fullWidth
                  onClick={() => facebookLogin()}
                  className={classes.facebookButton}
                >
                  <Facebook className={classes.signInIcon} />
                  Sign in with Facebook
                </Button>
                {/* <Button
                  variant="outlined"
                  size="large"
                  className={classes.linkedInButton}
                  fullWidth
                  onClick={() => linkedInLogin()}
                >
                  <img
                    src="https://img.icons8.com/color/24/000000/linkedin.png"
                    className={classes.linkedInIcon}
                  />
                  Sign in with LinkedIn
                </Button> */}
              </Container>
            </div>
          </Zoom>
        </Grid>
      </Grid>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  var data = context.query;
  if (data.status) {
    if (data.status == "success") {
      context.res.statusCode = 302;
      context.res.setHeader("Location", "/");
    }
  }

  return {
    props: {},
  };
};

export default withStyles(styles)(LoginPage);
