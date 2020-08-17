import React from "react";
import Layout from "components/Layout";
import { TableContainer, TableHead, TableCell, Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Timer from "../../components/Timer";
import Grid from "@material-ui/core/Grid";
import SecondaryNav from "../../components/SecondaryNav";
import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import CloseTwoToneIcon from "@material-ui/icons/CloseTwoTone";
import Loader from "../../components/loading";

class questionlist extends React.Component {
  state = {
    list: [],
    timestamp: "",
    message: "",
    performance: [],
    loaded: false,
    ended:false
  };

  componentDidMount() {
    if (!localStorage.token || !localStorage.code) window.location.href = "/";
    if (!localStorage.source) {
      var contestdeet = [
        {
          name: localStorage.code,
        },
      ];
      var arr = contestdeet;
      console.log(arr);

      localStorage.setItem("source", JSON.stringify(arr));
    } else {
      console.log(JSON.parse(localStorage.source));
      var source = JSON.parse(localStorage.source);
      var flag = false;
      source.map((el) => {
        console.log(el);
        if (el.name === localStorage.code) flag = true;
      });
      if (flag === false) {
        var newdeet = {
          name: localStorage.code,
        };
        source.push(newdeet);
        localStorage.setItem("source", JSON.stringify(source));
      }
    }
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getanswer?contest_id=${localStorage.code}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((resp) => {
        console.log("start");
        console.log(resp);
        this.setState({ performance: resp });
        console.log("end");
      })
      .then(() => {
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions?contest_id=${localStorage.code}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.token}`,
            },
          }
        )
          .then((respon) => respon.json())
          .then((res) => {
            res.map((question) => {
              console.log(question);
              question.icon = <div></div>;
              this.state.performance.map((ques) => {
                if (ques.ques_name === question.question_name) {
                  if (ques.correct >= 1) question.icon = <CheckTwoToneIcon />;
                  else question.icon = <CloseTwoToneIcon />;
                }
              });
            });
            this.setState({ list: res, loaded:true });
            var today = Date.now();
            var start = localStorage.start * 1000;
            var end = localStorage.end * 1000;
            console.log(start + "   " + today + "  " + end);
            if (start < today && end > today) {
              this.setState({
                timestamp: end,
                message: "The Contest ends in",
              });
            } else if (start < today && end < today) {
              this.setState({
                ended:true,
                timestamp: 0,
                message: "The Contest has ended",
              });
            } else if (start > today) {
              this.setState({
                timestamp: start,
                message: "The Contest begins in",
              });
            }
          })
          .catch((error) => {
            error = JSON.stringify(error);
            console.log(error);
          });
      });
  }

  render() {
    return (
      
      <Layout>
        
      {this.state.loaded ? 
      <>
        <SecondaryNav />
        <div style={{ maxWidth: "1000px", margin: "10px auto" }}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6}>
              <p
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  fontSize: "30px",
                  color: "#104e8b",
                  fontWeight: "bold",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0",
                  margin: "0 auto",
                }}
              >
                {/* {localStorage.contest_name} */}
                Contest Name
              </p>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Timer time={this.state.timestamp} message={this.state.message} />
            </Grid>
          </Grid>
        </div>
        <TableContainer
          component={Paper}
          style={{
            maxWidth: "1000px",
            margin: "20px auto",
            marginBottom: "100px",
          }}
        >
          <Table
            //className={classes.table}
            size="small"
            aria-label="simple table"
            style={{
              maxWidth: "1000px",
              margin: "0px auto",
              border: "2px solid #104e8b",
              borderRadius: "10px",
            }}
          >
            <TableHead style={{ paddingBottom: "20px" }}>
              <TableRow
                style={{
                  backgroundColor: "#104e8b",
                  color: "#fff",
                  paddingBottom: "20px",
                }}
              >
                <TableCell style={{ color: "#fff", padding: "20px" }}>
                  Question Code
                </TableCell>
                <TableCell
                  align="left"
                  style={{ color: "#fff", marginBottom: "20px" }}
                >
                  Question
                </TableCell>
                <TableCell
                  align="left"
                  style={{ color: "#fff", marginBottom: "20px" }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="right"
                  style={{ color: "#fff", marginBottom: "20px" }}
                >
                  Score
                </TableCell>
                {this.state.ended==false?(null):(
                <TableCell
                  align="right"
                  style={{ color: "#fff", marginBottom: "20px" }}
                >
                  Editorial
                </TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.list.length > 0
                ? this.state.list.map((item, i) => (
                    <>
                      <TableRow
                        key={i}
                        style={{
                          borderTop: "2px solid #104e8b",
                          borderBottom: "2px solid #104e8b",
                          borderRadius: "10px",
                          width: "100%",
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            textDecoration: "None",
                            color: "#104e8b",
                            padding: "20px",
                            margin: "10px",
                          }}
                        >
                          <a
                            href={`/question/description?id=${item.question_code}`}
                            style={{ textDecoration: "None", color: "#104e8b" }}
                          >
                            {item.question_code}
                          </a>
                        </TableCell>

                        <TableCell
                          align="left"
                          style={{
                            textDecoration: "None",
                            borderRadius: "10px",
                          }}
                        >
                          <a
                            href={`/question/description?id=${item.question_code}`}
                            style={{ textDecoration: "None", color: "#104e8b" }}
                          >
                            {item.question_name}
                          </a>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ textDecoration: "None", color: "#104e8b" }}
                        >
                          {item.icon}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ textDecoration: "None", color: "#104e8b" }}
                        >
                          {item.question_score}
                        </TableCell>
                        {this.state.ended==false?(null):(
                        <TableCell
                          align="right"
                          style={{
                            textDecoration: "None",
                            borderRadius: "10px",
                          }}
                        >
                          <a
                            href={`/question/editorial?id=${item.question_code}`}
                            style={{  textDecoration: "None", color: "#104e8b" }}
                          >
                            View Editorial
                          </a>
                        </TableCell>)}
                      </TableRow>
                    </>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="FooterFixed">
          &copy; Created and maintained by GNU/Linux Users' group, Nit Durgapur
        </div>
        </>
        : <Loader />}
          
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
