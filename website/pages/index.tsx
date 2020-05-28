import React from "react";
import { Grid, Typography, Card, CardHeader, CardContent } from "@material-ui/core";
import { } from "@material-ui/icons";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../components/Monaco_Editor"), { ssr: false });

const styles = createStyles((theme: Theme) => ({
    "@global": {
        body: {
        },
    },
    "@keyframes move": {
        from: {
            transform: "translate(-50%, 200%)",
            opacity: 0,
        },
        to: {
            transform: "translate(-50%, -50%)",
            opacity: 1,
        },
    },
    card: {
        marginBottom: theme.spacing(3)
    }
}));

interface IProps {
    classes: any;
}

class IndexPage extends React.Component<IProps, {}> {
    componentDidMount() { }

    render() {
        const { classes } = this.props;
        return (
            <Layout>
                <Grid container justify="center" alignItems="center" direction="column">
                    <Card className={classes.card}>
                        <CardHeader title="Sum of two" />
                        <CardContent>
                            <Typography>Maths and logic are
                             the necessary parts of programming that can be learned throu
                             gh practice. Here is a simple mathematical problem of additio
                             n for you to solve.</Typography>
                        </CardContent>
                    </Card>
                    <Editor/>
                </Grid>
            </Layout>
        );
    }
}

export default withStyles(styles)(IndexPage);
