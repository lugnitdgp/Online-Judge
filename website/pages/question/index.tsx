import React from "react";
import Layout from 'components/Layout';
import { TableContainer, TableHead, TableCell, Paper} from '@material-ui/core';
import { withStyles, createStyles, Theme, } from "@material-ui/core/styles";

interface IState {
  list: Array<any>;
}

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black
    },
    body: {
      fontSize: 14,
    }
  })
)(TableCell);

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
      <TableContainer component={Paper}>
           <TableHead>
                    <StyledTableCell>Question Code</StyledTableCell>
                    <StyledTableCell>QUESTION</StyledTableCell>
                    <StyledTableCell>SCORE</StyledTableCell>
             
            </TableHead>
        {this.state.list.map((item, i) => (
          
          <div key={i}>

          <TableCell>{item.question_code}</TableCell>

            <TableCell><a href={`/question/${item.question_code}`}>{item.question_name}</a></TableCell>
            
            <TableCell>{item.question_score}</TableCell>
          </div>
          
        ))}
        </TableContainer>
      </Layout>
    );
  }
}

export default questionlist;
