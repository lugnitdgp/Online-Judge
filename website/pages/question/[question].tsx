import React from "react";
import { GetServerSideProps } from "next";
import Cookie from "lib/models/Cookie";
import { Card, CardHeader, CardContent, Button, Grid, FormControl, InputLabel, MenuItem } from "@material-ui/core";
import Select from '@material-ui/core/Select';
import Editor from "components/Editor";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

interface IProps {
  data: any;
}

interface IState {
  value: string;
  lang: string;
  res: any;
}

class QuesDetail extends React.Component<IProps, IState> {
  constructor(props: Readonly<IProps>) {
    super(props);
    this.state = {
      value: "",
      lang: "c++",
      res: []
    };
  }

  // static useStyles = makeStyles({
  //   table: {
  //     minWidth: 650,
  //   },
  // });

  // static classes = this.useStyles();

  submitcode = (code: any, lang: any) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.token}`,
      },
      body: JSON.stringify({
        code: encodeURI(code),
        lang: lang,
        q_id: this.props.data.question_code,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        localStorage.taskid = res["task_id"];
      })
      .catch((error) => console.log(error));
  };

  statuscode = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.token}`,
      },
      body: JSON.stringify({
        q_id: this.props.data.question_code,
        task_id: localStorage.taskid,
      }),
    }).then((resp) => resp.json())
      .then((response) => this.setState({ res: response }))
      .then(() => console.log(this.state.res))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <Grid container justify="center">
        <Grid item>
          <p>{this.props.data.question_text}</p>
          <p>{this.props.data.question_code}</p>
          <Card>
            <CardHeader title="Input Example" />
            <CardContent>
              <div
                style={{ whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{
                  __html: this.props.data.input_example,
                }}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Output Example" />
            <CardContent>
              <div
                style={{ whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{
                  __html: this.props.data.output_example,
                }}
              />
            </CardContent>
          </Card>
          <FormControl variant="outlined" fullWidth style={{ margin: "16px" }}>
            <InputLabel>Select Language</InputLabel>
            <Select value={this.state.lang}
              onChange={(e) => this.setState({ lang: e.target.value as string })}
            >
              <MenuItem value="c">C</MenuItem>
              <MenuItem value="c++">C++</MenuItem>
              <MenuItem value="python3">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
            </Select>
          </FormControl>
          <Editor
            value={this.state.value}
            lang={this.state.lang}
            setValue={(d) =>
              this.setState({
                value: d,
              })
            }
          />
          <Button
            variant="outlined"
            onClick={() => this.submitcode(this.state.value, this.state.lang)}
          >
            Submit
          </Button>
          <Button variant="outlined" onClick={() => this.statuscode()}>
            Check for Changes
          </Button>
          {(this.state.res.length > 1) ? (
            <TableContainer component={Paper}>
              <Table style={{
                minWidth: 650,
              }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>TestCase (Number)</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Run-Time</TableCell>
                    <TableCell align="right">Memory Used</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.res.map((res, index) =>
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="right">{res.status.run_status}</TableCell>
                      <TableCell align="right">{res.status.cpu_time}</TableCell>
                      <TableCell align="right">{res.status.memory_taken}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : <React.Fragment>{this.state.res.map((res, index) =>
            <div key={index}>
              <p>Compilation Error</p>
              <p>{res.message}</p>
            </div>
          )}</React.Fragment>}
        </Grid>
      </Grid>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = new Cookie();
  cookie.parse(context.req.headers.cookie || "");

  try {
    let resp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quesdetail?q_id=${context.params?.question}`,
      {
        headers: {
          Authorization: `Token ${cookie.cookies.get("token")}`,
        },
      }
    );

    let response = await resp.json();

    return {
      props: {
        data: response,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        data: "",
      },
    };
  }
};

export default QuesDetail;
