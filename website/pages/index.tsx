import React from "react";
import { Grid, Typography, Card, CardHeader, CardContent } from "@material-ui/core";
import { } from "@material-ui/icons";
import { withStyles,} from "@material-ui/core/styles";
import styles from "../styles/IndexStyles";
import Layout from "../components/Layout";


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
                <main className={classes.main}>
                    <Card className={classes.card}>
                        <CardHeader title="Sum of two" />
                        <CardContent>
                            <Typography>Maths and logic are
                             the necessary parts of programming that can be learned throu
                             gh practice. Here is a simple mathematical problem of additio
                             n for you to solve.</Typography>
                        </CardContent>
                    </Card>
                    </main>
                </Grid>
            </Layout>
          
        );
    }
}

export default withStyles(styles)(IndexPage);
