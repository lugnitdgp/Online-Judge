import React from "react";
import Layout from "components/Layout";
import { TableContainer, TableHead, TableCell, Paper } from "@material-ui/core";
import {
  withStyles,
  createStyles,
  Theme,
  makeStyles,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";

interface IState {
  list: Array<any>;
}

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    body: {
      fontSize: 14,
    },
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
        {/* <TableContainer component={Paper}>
          <TableHead>
            <StyledTableCell>Question Code</StyledTableCell>
            <StyledTableCell>QUESTION</StyledTableCell>
            <StyledTableCell>SCORE</StyledTableCell>
          </TableHead>
          {this.state.list
            ? this.state.list.map((item, i) => (
                <div key={i}>
                  <TableCell>{item.question_code}</TableCell>

                  <TableCell>
                    <a href={`/question/${item.question_code}`}>
                      {item.question_name}
                    </a>
                  </TableCell>

                  <TableCell>{item.question_score}</TableCell>
                </div>
              ))
            : null}
        </TableContainer> */}
        <TableContainer
          component={Paper}
          style={{ maxWidth: "700px", margin: "30px auto" }}
        >
          <Table
            //className={classes.table}
            size="small"
            aria-label="simple table"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            <TableHead>
              <TableRow style={{ backgroundColor: "#bbaaff" }}>
                <TableCell>Question Code</TableCell>
                <TableCell align="left">Question</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
              {this.state.list
                ? this.state.list.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ textDecoration: "None", color: "#512daa" }}
                      >
                        <a
                          href={`/question/${item.question_code}`}
                          style={{ textDecoration: "None", color: "#512daa" }}
                        >
                          {item.question_code}
                        </a>
                      </TableCell>

                      <TableCell
                        align="left"
                        style={{ textDecoration: "None" }}
                      >
                        <a
                          href={`/question/${item.question_code}`}
                          style={{ textDecoration: "None", color: "#512daa" }}
                        >
                          {item.question_name}
                        </a>
                      </TableCell>

                      <TableCell
                        align="right"
                        style={{ textDecoration: "None", color: "#441199" }}
                      >
                        {item.question_score}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Layout>
    );
  }
}

export default questionlist;
