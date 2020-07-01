import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import useInputState from "../../hooks/useInputState";
import { GetServerSideProps } from "next";
import { Facebook } from "@material-ui/icons";

const styles = createStyles((theme: Theme) => ({
  main: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },

  form: {
    width: "100%",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  signInIcon: {
    color: "white",
    marginRight: theme.spacing(1),
  },
  googleButton: {
    borderColor: "red",
    padding: theme.spacing(1),
    color: "red",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  facebookButton: {
    color: "white",
    backgroundColor: "#4267b2",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    "&:hover": {
      backgroundColor: "blue",
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
  url.searchParams.set(
    "client_id",
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
  );
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
  url.searchParams.set(
    "client_id",
    process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || ""
  );
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

function LoginPage(props: Props) {
  const { classes } = props;
  const [value, handleChange, reset] = useInputState("");
  const [isLogin, toggleLogin] = useState(false);

  const toggleisLogin = () => {
    toggleLogin(!isLogin);
  };

  return (
    <main className={classes.main}>
      {isLogin ? (
        <Paper className={classes.paper}>
          <Avatar
            className={classes.avatar}
            src="https://img.icons8.com/officel/80/000000/court-judge.png"
          />
          <Typography variant="h3" gutterBottom>
            Login
          </Typography>
          <form
            className={classes.form}
            onSubmit={(e) => {
              e.preventDefault();
              reset();
            }}
          >
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                value={value.email}
                onChange={handleChange}
                id="email"
                name="email"
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                value={value.password}
                onChange={handleChange}
                id="password"
                name="password"
                autoFocus
              />
            </FormControl>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              className={classes.submit}
            >
              LogIn
            </Button>
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
              Login with Google
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
              Login with Facebook
            </Button>
          </form>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => toggleisLogin()}
            style={{ border: "None", outline: "none" }}
          >
            Didn't Sign Up? Register here.
          </Button>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Avatar
            className={classes.avatar}
            src="https://img.icons8.com/officel/80/000000/court-judge.png"
          />
          <Typography variant="h3" gutterBottom>
            Register
          </Typography>
          <form
            className={classes.form}
            onSubmit={(e) => {
              e.preventDefault();
              reset();
            }}
          >
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                value={value.username}
                onChange={handleChange}
                id="username"
                name="username"
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                value={value.email}
                onChange={handleChange}
                id="email"
                name="email"
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                value={value.password}
                onChange={handleChange}
                id="password"
                name="password"
                autoFocus
              />
            </FormControl>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              className={classes.submit}
            >
              SignUp
            </Button>
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
              Sign Up with Google
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
              Sign Up with Facebook
            </Button>
          </form>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => toggleisLogin()}
            style={{ border: "None", outline: "none" }}
          >
            Already Registered? Login here.
          </Button>
        </Paper>
      )}
    </main>
  );
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
