import React from "react";
import Cookie from "lib/models/Cookie";
import {
  Button,
  FormControl,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import Editor from "components/editor";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Layout from "components/layout";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckCircleOutline, Error } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FileCopySharpIcon from "@material-ui/icons/FileCopySharp";
import Timer from "../../components/Timer";
import SecondaryNav from "../../components/secondaryNav";
import Loader from "../../components/loading";
import Disqus from "disqus-react"
//import zIndex from "@material-ui/core/styles/zIndex";
//import ModalButton from "./modal-button";

const styles = createStyles((theme: Theme) => ({
  root: {
    width: "100%",
    marginBottom: 0,
    marginRight: "auto",
    marginLeft: "auto",
    textAlign: "center",
  },
  paper: {
    flexDirection: "column",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(5),
    minHeight: "80%",
    maxWidth: "1300px",
    border: "2px solid #104e8b",
    borderTop: "10px solid #104e8b",
    borderBottom: "10px solid #104e8b",
    borderRadius: "20px",
  },
  paper2: {
    flexDirection: "column",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(8),
    maxWidth: "1300px",
    overflow: "hidden",
    border: "2px solid #104e8b",
    borderTop: "10px solid #104e8b",
    borderBottom: "10px solid #104e8b",
    borderRadius: "20px",
  },
  details: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(1.8),
    minWidth: 120,
    overflow: "hidden",
  },
  button: {
    marginTop: theme.spacing(3),
  },
}));

interface IProps {
  classes: any;
}

interface IState {
  value: string;
  lang: string;
  theme: string;
  res: any;
  isLoading: boolean;
  showModal: boolean;
  data: any;
  question: string;
  copied: boolean;
  timestamp: any;
  message: string;
  loaded:boolean;
  ended:boolean;
}

class QuesDetail extends React.Component<IProps, IState> {
  interval: any;
  autosave: any;
  constructor(props: Readonly<IProps>) {
    super(props);
    this.state = {
      value: "",
      lang: "c++",
      theme: "theme-terminal",
      res: [],
      isLoading: false,
      showModal: false,
      data: {},
      question: "",
      copied: false,
      timestamp: "",
      message: "",
      loaded: false,
      ended: false,
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.changeCopyState = this.changeCopyState.bind(this);
  }
  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  changeCopyState() {
    this.setState({ copied: true }, () => {
      setTimeout(() => this.setState({ copied: false }), 1500);
    });
  }
  submitcode = (code: any, lang: any) => {
    this.setState({
      isLoading: true,
      res: [],
    });
    var self = this;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.token}`,
      },
      body: JSON.stringify({
        code: encodeURI(code),
        lang: lang,
        q_id: this.state.data.question_code,
        contest_id: localStorage.code,
      }),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        if (res.status === 302) {
          alert(res.message);
          this.setState({
            isLoading: false,
          });
        } else {
          localStorage.taskid = res["task_id"];
          self.interval = setInterval(() => self.statuscode(), 2000);
        }
      })
      .catch((error) => console.log(error));
  };

  source = [];

  autosavecode = (code: any, lang: any) => {
    // var source2=[]
    var source = this.source;
    var source2 = [];
    source.map((contest) => {
      if (contest.name === localStorage.code) {
        var sourcecode = {
          lang: lang,
          code: encodeURI(code),
          qid: getParameterByName("id"),
        };
        if (!contest.questions) {
          contest.questions = [sourcecode];
        } else {
          var flag = false;
          contest.questions.map((ques) => {
            if (ques.qid === sourcecode.qid) {
              ques.code = sourcecode.code;
              ques.lang = sourcecode.lang;
              flag = true;
            }
          });
          if (flag === false) {
            contest.questions.push(sourcecode);
          }
        }
      }
      source2.push(contest);
    });
    this.source = source2;
    localStorage.setItem("source", JSON.stringify(this.source));
  };

  statuscode = () => {
    var self = this;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.token}`,
      },
      body: JSON.stringify({
        q_id: this.state.data.question_code,
        task_id: localStorage.taskid,
        contest_id: localStorage.code,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log(response);
        if (response.status === 302) {
          alert(response.message);
        } else {
          console.log(response);
          self.setState({ res: response, isLoading: false });
          clearInterval(self.interval);
        }
      })
      .then(() => console.log(this.state.res))
      .catch((err) => console.log(err));
  };
  async componentDidMount() {
    if (!localStorage.token || !localStorage.code) window.location.href = "/";
    const cookie = new Cookie();
    cookie.parse(document.cookie || "");
    if (!localStorage.source) window.location.href = "/question";
    else {
      this.source = JSON.parse(localStorage.source);
      var source = JSON.parse(localStorage.source);
      source.map((contest) => {
        if (contest.name === localStorage.code) {
          if (contest.questions)
            contest.questions.map((ques) => {
              if (ques.qid === getParameterByName("id"))
                this.setState({
                  value: decodeURI(ques.code),
                  lang: ques.lang,
                });
            });
        }
      });
    }

    try {
      let resp = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quesdetail?contest_id=${
          localStorage.code
        }&q_id=${getParameterByName("id")}`,
        {
          headers: {
            Authorization: `Token ${cookie.cookies.get("token")}`,
          },
        }
      );

      let response = await resp.json();
      console.log(response);
      this.setState({
        data: response,
        loaded: true,
      });

      var today = Date.now();
      var start = localStorage.start * 1000;
      var end = localStorage.end * 1000;

      if (start < today && end > today) {
        this.setState({
          timestamp: end,
          message: "The Contest ends in",
        });
      } else if (start < today && end < today) {
        this.setState({
          timestamp: 0,
          message: "The Contest has ended",
          ended: true,
        });
      } else if (start > today) {
        this.setState({
          timestamp: start,
          message: "The Contest begins in",
        });
      }
    } catch (error) {
      console.error(error);
    }
    //this.autosave = setInterval(() => this.autosavecode(this.state.value, this.state.lang) ,1000 )
  }

  render() {
    const { classes } = this.props;
    const disqusShortname = "onlinejudge-1"
    const disqusConfig = {
      url: "http://localhost:3000",
      identifier: "article-id",
      title: "Title of Your Article"
    }
    return (
      <Layout>
        {this.state.loaded ? 
      <>
        <SecondaryNav />
        <div style={{ maxWidth: "1000px", margin: "0px auto", padding: "0" }}>
          <Timer
            time={this.state.timestamp}
            message={this.state.message}
            style={{ fontSize: "12px" }}
          />
        </div>
        <div style={{ margin: "20px" }}>
          <Paper
            elevation={0}
            className={classes.paper}
            style={{ margin: "20px auto" }}
          >
            <div className={classes.details}>
              <Typography
                className={classes.title}
                style={{
                  color: "#104e8b",
                  fontSize: "18px",
                  textTransform: "capitalize",
                }}
                gutterBottom
              >
                {this.state.data.question_code}&nbsp;|&nbsp;
                {this.state.data.question_name}
              </Typography>

              <div
                style={{ fontSize: 15 }}
                dangerouslySetInnerHTML={{
                  __html: this.state.data.question_text,
                }}
              />
              <hr></hr>
              <CopyToClipboard
                text={this.state.data.input_example}
                onCopy={this.changeCopyState}
              >
                <Typography
                  style={{ fontSize: "18px", color: "#104e8b" }}
                  gutterBottom
                >
                  <div>
                    <div className="row">
                      <div
                        className="column"
                        style={{ marginLeft: 15, verticalAlign: "middle" }}
                      >
                        INPUT EXAMPLE
                      </div>
                      <div className="column">
                        <Tooltip
                          title={
                            this.state.copied ? "COPIED !" : "COPY TO CLIPBOARD"
                          }
                        >
                          <IconButton aria-label="upload picture">
                            <FileCopySharpIcon
                              style={{
                                width: 20,
                                height: 20,
                                bottom: 10,
                                position: "relative",
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                    <Typography variant="subtitle1" gutterBottom>
                      <div
                        style={{ whiteSpace: "pre-wrap" }}
                        dangerouslySetInnerHTML={{
                          __html: this.state.data.input_example,
                        }}
                      />
                    </Typography>
                  </div>
                </Typography>
              </CopyToClipboard>
              <hr></hr>
              <CopyToClipboard
                text={this.state.data.output_example}
                onCopy={this.changeCopyState}
              >
                <Typography
                  style={{ fontSize: "18px", color: "#104e8b" }}
                  gutterBottom
                >
                  <div>
                    <div className="row">
                      <div
                        className="column"
                        style={{ marginLeft: 15, verticalAlign: "middle" }}
                      >
                        OUTPUT EXAMPLE
                      </div>
                      <div className="column">
                        <Tooltip
                          title={
                            this.state.copied ? "COPIED !" : "COPY TO CLIPBOARD"
                          }
                        >
                          <IconButton aria-label="upload picture">
                            <FileCopySharpIcon
                              style={{
                                width: 20,
                                height: 20,
                                bottom: 10,
                                position: "relative",
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                    <Typography variant="subtitle1" gutterBottom>
                      <div
                        style={{ whiteSpace: "pre-wrap" }}
                        dangerouslySetInnerHTML={{
                          __html: this.state.data.output_example,
                        }}
                      />
                    </Typography>
                  </div>
                </Typography>
              </CopyToClipboard>
            </div>
          </Paper>

          <Paper elevation={0} className={classes.paper2}>
            <div style={{ margin: "0 auto", textAlign: "center" }}>
              <FormControl className={classes.formControl}>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  value={this.state.lang}
                  onChange={(e) =>
                    this.setState({ lang: e.target.value as string })
                  }
                >
                  <MenuItem value="c">C</MenuItem>
                  <MenuItem value="c++">C++</MenuItem>
                  <MenuItem value="python3">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.formControl}>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  value={this.state.theme}
                  onChange={(e) =>
                    this.setState({ theme: e.target.value as string })
                  }
                >
                  <MenuItem value="theme-terminal">terminal</MenuItem>
                  <MenuItem value="theme-tomorrow">tomorrow</MenuItem>
                  <MenuItem value="theme-twilight">twilight</MenuItem>
                </Select>
              </FormControl>
              <Editor
                value={this.state.value}
                lang={this.state.lang}
                theme={this.state.theme}
                setValue={(d) => {
                  this.setState(
                    {
                      value: d,
                    },
                    () => {
                      this.autosavecode(this.state.value, this.state.lang);
                    }
                  );
                }}
              />

              {this.state.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                <Button
                  className={classes.button}
                  color="primary"
                  variant="outlined"
                  style={{
                    border: "None",
                    backgroundColor: "#104e8b",
                    height: "30px",
                    width: "100px",
                    borderRadius: "5px",
                    color: "white",
                    textDecoration: "None",
                    marginBottom: "20px",
                  }}
                  onClick={() =>
                    this.submitcode(this.state.value, this.state.lang)
                  }
                >
                  Submit
                </Button>
              )}
            </div>

            {this.state.res.length > 1 ? (
              <TableContainer component={Paper}>
                <Table
                  style={{
                    minWidth: 650,
                  }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>TestCase (Number)</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Run-Time</TableCell>
                      <TableCell align="right">Memory Used</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.res.map((resa, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="right">
                          <ResultStatus status={resa.status.run_status} />
                        </TableCell>
                        <TableCell align="right">
                          {resa.status.cpu_time}
                        </TableCell>
                        <TableCell align="right">
                          {resa.status.memory_taken}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <React.Fragment>
                {this.state.res.map((resa, index) => (
                  <div>
                    {resa.message ? (
                      <div key={index}>
                        <p>Compilation Error</p>
                        <p>{resa.message.split(",", 2)[1]}</p>
                      </div>
                    ) : (
                      <TableContainer component={Paper}>
                        <Table
                          style={{
                            minWidth: 650,
                          }}
                          aria-label="simple table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>TestCase (Number)</TableCell>
                              <TableCell align="right">Status</TableCell>
                              <TableCell align="right">Run-Time</TableCell>
                              <TableCell align="right">Memory Used</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell align="right">
                                <ResultStatus status={resa.status.run_status} />
                              </TableCell>
                              <TableCell align="right">
                                {resa.status.cpu_time}
                              </TableCell>
                              <TableCell align="right">
                                {resa.status.memory_taken}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </div>
                ))}
              </React.Fragment>
            )}
          </Paper>
        </div>
        
        {this.state.ended ? 
        <div></div>
          :
        <Paper elevation={0} className={classes.paper2}>
            <div style={{ margin: "20px", textAlign: "center" }}>
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
        </div>
        </Paper>
        }

        <div className="Footer">
          &copy; Created and maintained by GNU/Linux Users' group, Nit Durgapur
        </div>
        </>
        : <Loader />}
        
      </Layout>
    );
  }
}

function ResultStatus({ status }) {
  if (status == "AC") {
    return <CheckCircleOutline />;
  } else if (status == "WA") {
    return <Error />;
  } else return status;
}

function getParameterByName(name, url = window.location.href) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default withStyles(styles)(QuesDetail);
//////////
