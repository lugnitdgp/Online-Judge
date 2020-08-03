import React from "react";
import Layout from "components/Layout";
import {
  TableContainer,
  TableHead,
  TableCell,
  Paper,
  Button,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Timer from "../../components/Timer";
import Router from "next/router";

class questionlist extends React.Component {
  state = {
    list: [],
    timestamp: "",
    message: "",
  };

  componentDidMount() {
    if (!localStorage.token || !localStorage.code) window.location.href = "/";
    if (!localStorage.source) {
      var contestdeet = [{
        name: localStorage.code
      }]
      var arr = contestdeet
      console.log(arr)

      localStorage.setItem('source', JSON.stringify(arr))
    }
    else {
      console.log(JSON.parse(localStorage.source))
      var source = JSON.parse(localStorage.source)
      var flag = false;
      source.map((el) => {
        console.log(el)
        if (el.name === localStorage.code)
          flag = true;
      })
      if (flag === false) {
        var newdeet = {
          name: localStorage.code
        }
        source.push(newdeet)
        localStorage.setItem('source', JSON.stringify(source))
      }



    };
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions?contest_id=${localStorage.code}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.token}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({ list: res });
        var today = Date.now();
        var start = (localStorage.start) * 1000;
        var end = (localStorage.end) * 1000;

        if (start < today && end > today) {
          this.setState({
            timestamp: end,
            message: "The Contest ends in ...",
          });
        } else if (start < today && end < today) {
          this.setState({
            timestamp: 0,
            message: "The Contest has ended",
          });
        } else if (start > today) {
          this.setState({
            timestamp: start,
            message: "The Contest begins in ...",
          });
        }
      })
      .catch((error) => {
        error = JSON.stringify(error);
        console.log(error);
      });
  }

  render() {
    return (
      <Layout>

        <div
          style={{
            maxWidth: "1000px",
            margin: "30px auto",
            borderRadius: "5px",
            backgroundColor: "#3344ff",
            height: "50px",
            color: "white",
            textAlign: "center",
            fontSize: "19px",
            padding: "5px",
          }}
        >
          {localStorage.onlinejudge_info ? (
            <Button color="inherit" onClick={() => Router.push("/submissions")}>
              All Submissons
            </Button>
          ) : (
              <div></div>
            )}

          {localStorage.onlinejudge_info ? (
            <Button color="inherit" onClick={() => Router.push("/leaderboard")}>
              Leaderboard
            </Button>
          ) : (
              <div></div>
            )}
          {localStorage.onlinejudge_info ? (
            <Button
              color="inherit"
              onClick={() => Router.push("/personalsubmissions")}
            >
              My Submissions
            </Button>
          ) : (
              <div></div>
            )}
        </div>
        <TableContainer
          component={Paper}
          style={{
            maxWidth: "1000px",
            margin: "0px auto",
            marginBottom: "0px",
          }}
        >
          <Table
            //className={classes.table}
            size="small"
            aria-label="simple table"
            style={{ maxWidth: "1000px", margin: "0 auto" }}
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
                        href={`/question/description?id=${item.question_code}`}
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
                        href={`/question/description?id=${item.question_code}`}
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
        <div style={{ maxWidth: "1000px", margin: "0px auto" }}>
          <Timer time={this.state.timestamp} message={this.state.message} />
        </div>
      </Layout>
    );
  }
}

export default questionlist;

{
  /* <CopyToClipboard text={this.props.data.input_example} onCopy={this.changeCopyState}>
                <Typography variant="subtitle1" gutterBottom>
                  <div
                    style={{ whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{
                      __html: this.props.data.input_example,
                    }}
                  />

                  <Tooltip title={this.state.copied ? "COPIED !" : "COPY TO CLIPBOARD"}>
                    <IconButton aria-label="upload picture" component="span">
                      < FileCopyRoundedIcon />
                    </IconButton>
                  </Tooltip>

                </Typography>
              </CopyToClipboard> */
}
