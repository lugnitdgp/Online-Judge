import React from "react";
import Layout from "components/Layout";
import { TableContainer, TableHead, TableCell, Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Timer from "../../components/Timer"


class questionlist extends React.Component {
  state = {
    list: [],
    timestamp: '',
    message: ''
  }


  componentDidMount() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions?contest_id=${localStorage.code}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({ list: res })
        var today = Date.now()
        var start = (localStorage.start - 19800) * 1000
        var end = (localStorage.end - 19800) * 1000

        if (start < today && end > today) {
          this.setState({
            timestamp: end,
            message: 'The Contest ends in ...'
          })
        }
        else if (start < today && end < today) {
          this.setState({
            timestamp: 0,
            message: 'The Contest has ended'
          })
        }
        else if (start > today) {
          this.setState({
            timestamp: start,
            message: 'The Contest begins in ...'
          })
        }
      })
      .catch((error) => {
        error = JSON.stringify(error)
        console.log(error);
      });
  }

  render() {
    return (
      <Layout>
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
        <div
          style={{ maxWidth: "700px", margin: "30px auto" }}>          <Timer time={this.state.timestamp} message={this.state.message} />
        </div>
      </Layout>
    );
  }
}

export default questionlist;
