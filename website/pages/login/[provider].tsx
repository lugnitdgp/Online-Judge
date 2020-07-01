import React from "react";
import { Container, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { } from "@material-ui/icons";
import UserContextProvider from '../../components/UserContextProvider';

const styles = makeStyles((theme: Theme) => ({
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

function LoginPage(props: Props) {
  const [error, setError] = React.useState(false);

  const googleLogin = () => {
    fetch("/api/login/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: props.code,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/social_login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            id_token: res.id_token,
            provider: "google",
          }),
        })
          .then((resp) => resp.json())
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
            window.location.href = "/"
          })
          .catch((e) => {
            console.log(e);
            setError(true)
          });
      })
      .catch((err) => {
        console.log(err);
        setError(true)
      })
  }

  //This works
  // React.useEffect(() => {
  //   storeUser({
  //     name: "wqygubcjqnc",
  //     email: "asbcascacsj",
  //     image_link: "asjbcjasnck"
  //   });
  //   showUser();
  // });

  const facebookLogin = () => {
    fetch("/api/login/facebook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: props.code,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
          method: "POST",
          body: JSON.stringify({
            access_token: res.access_token,
            provider: "facebook",
          }),
        })
          .then((resp) => resp.json())
          .then((response) => {
            localStorage.token = response.token;
            window.location.href = "/";
          })
          .catch((e) => {
            console.log(e);
            setError(true)
          });
      })
      .catch((err) => {
        console.log(err);
        setError(true)
      });
  }

  React.useEffect(() => {
    if (props.provider == "google") googleLogin();
    else if (props.provider == "facebook") facebookLogin();
    else alert("Invalid login provider");
  }, [])

  const classes = styles()

  return (
    <UserContextProvider>
      <Container className={classes.root}>
        {error ? (
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
    </UserContextProvider>
  );
}


export const getServerSideProps = async (context: any) => {
  return {
    props: {
      provider: context.params?.provider,
      code: context.query.code,
    },
  };
};

export default LoginPage