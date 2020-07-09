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

function LoginPage() {
    const [error, setError] = React.useState(false);

    const googleLogin = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/oauth/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: getParameterByName('code'),
                redirect_uri: window.location.protocol + "//" + window.location.host,
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
                        window.location.href = "/question"
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

    React.useEffect(() => {
        googleLogin();
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

function getParameterByName(name, url = window.location.href) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export default LoginPage