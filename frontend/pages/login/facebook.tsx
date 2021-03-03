import React from "react";
import {CircularProgress, Typography } from "@material-ui/core";
import { } from "@material-ui/icons";


function LoginPage() {
    const [error, setError] = React.useState(false);

    const facebookLogin = () => {
        fetch("/api/login/facebook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: getParameterByName("code"),
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
        facebookLogin();

    }, [])


    return (
            <div className="socialRoot">
                {error ? (
                    <React.Fragment >
                        <Typography className="socialError" variant="h6" color="error">
                            Something went wrong. Please try again. If the problem still
                            exists, contact the administrator.
          </Typography>
                    </React.Fragment>
                ) : (
                        <React.Fragment>
                            <CircularProgress size={"4rem"} />
                            <Typography variant="h6" className="socialTitle">
                                Logging you in
          </Typography>
                        </React.Fragment>
                    )}</div>
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