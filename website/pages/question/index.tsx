import React from "react";
import Layout from "components/Layout";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";


interface IState {
  list: Array<any>;
}

class questionlist extends React.Component<{}, IState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = { list: [] };
  }

  componentDidMount() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions`, {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => this.setState({ list: res }))
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
 
    return (
      <Layout>
        <Grid container style={{
        }}>
        {this.state.list
            ? this.state.list.map((item, i) => (
                <div key={i}>
            <Card  elevation={3} style={{
               width : 820,
               height: 150,
               paddingTop : 3,
            }}>
        <CardContent>
          <Typography  color="textSecondary" gutterBottom>
              {item.question_code}
        </Typography>
                
        <Typography variant="h4" component="h2">
        {item.question_name}
        </Typography>
            </CardContent>
               
                <Button color="primary" variant="outlined">
                <a href={`/question/${item.question_code}`}>
                   SOLVE CHALLENGE
                 </a>
                 </Button>
            
        </Card>
                </div>
              ))
            : null}
        </Grid>
      </Layout>
    );
  }
}

export default  questionlist;
