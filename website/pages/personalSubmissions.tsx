import React from "react";
import Layout from "../components/layout";
import MUIDataTable from "mui-datatables";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Viewer from "components/codeViewer";
import { Card } from "@material-ui/core";
import { Button } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SecondaryNav from "../components/secondaryNav";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Loader from "../components/loading";

const customStyles = () => ({
  Successful: {
    "& td": { backgroundColor: "#99ff99" },
  },
  WA: {
    "& td": { backgroundColor: "#ff6961" },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: "#fff",
    border: '2px solid #104e8b',
    borderTop:"10px solid #104e8b",
    borderBottom:"10px solid #104e8b",
    outline:"none",
    padding: "30px",
    borderRadius:"20px",
    minWidth:"70%",
    minHeight:"90%",
    color:"#104e8b",
    overflow:"auto",
    
  },
});

interface IProps {
  classes: any;
}

class submissions extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    list: [],
    open: false,
    view: "",
    modallang: "",
    exec: [],
    loaded: false,
  };
  constructor(props: Readonly<IProps>) {
    super(props);

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal(data) {
    data.testcases.map((a) => {
      if (a[`code`] == 1) {
        var status = {
          run_status: "Compilation Error",
          cpu_time: "NA",
          elapsed_time: "NA",
          memory_taken: "NA",
        };

        a.status = status;
      }
    });

    this.setState({
      view: data.source,
      modallang: data.lang,
      exec: data.testcases,
      open: true,
    });
  }

  handleCloseModal() {
    this.setState({ open: false });
  }

  
  componentDidMount() {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/personalsubmissions?contest_id=${localStorage.code}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.token}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((res) => {
        var arr = [];
        console.log(res);
        res.map((r) => {
          var stat = "";
          var time = "";
          var mem = "";
          const cases = JSON.parse(r.status);
          cases.map((testcase) => {
            if (testcase.code == 1) {
              stat = "Compilation Error";
              time = "NA";
              mem = "NA";
            } else {
              if (testcase.status.run_status == "AC") {
                if (stat == "") {
                  stat = "AC";
                  time = testcase.status.cpu_time + " sec";
                  mem = testcase.status.memory_taken + " kb ";
                }
              } else {
                stat = testcase.status.run_status;
                time = testcase.status.cpu_time + " sec";
                mem = testcase.status.memory_taken + " kb";
              }
            }
          });

          var runtimestats = {
            source: r.code,
            testcases: cases,
            lang: r.lang,
          };

          var payload = {
            user: r.name,
            problem: r.question_name,
            status: stat,
            time: time,
            memory: mem,
            code: runtimestats,
          };

          arr.push(payload);
        });
        this.setState({ list: arr, loaded: true });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const columns = [
      {
        name: "user",
        label: "  USER",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => ({
            style: {
              textAlign: "left",
              textDecoration: "bold",
              color: "#104e8b",
            },
          }),

          setCellProps: () => ({
            style: {
              fontWeight: "bolder",
              fontSize: 14,
              textAlign: "left",
              color: "#104e8b",
            },
          }),
        },
      },
      {
        name: "problem",
        label: "PROBLEM",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => ({
            style: {
              textAlign: "center",
              fontWeight: "bolder",
              color: "#104e8b",
            },
          }),

          setCellProps: () => ({
            style: { fontSize: 15, textAlign: "center", color: "#104e8b" },
          }),
        },
      },

      {
        name: "status",
        label: "STATUS",
        options: {
          filter: true,
          sort: false,
          setCellHeaderProps: () => ({
            style: { textAlign: "center", color: "#104e8b" },
          }),

          setCellProps: () => ({
            style: { fontSize: 15, textAlign: "center", color: "#104e8b" },
          }),
        },
      },
      {
        name: "time",
        label: "TIME",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => ({
            style: {
              textAlign: "center",
              textDecoration: "bold",
              color: "#104e8b",
            },
          }),

          setCellProps: () => ({
            style: {
              fontWeight: "bolder",
              fontSize: 15,
              textAlign: "center",
              color: "#104e8b",
            },
          }),
        },
      },
      {
        name: "memory",
        label: "MEMORY",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => ({
            style: {
              textAlign: "center",
              textDecoration: "bold",
              color: "#104e8b",
            },
          }),

          setCellProps: () => ({
            style: {
              fontWeight: "bolder",
              fontSize: 15,
              textAlign: "center",
              color: "#104e8b",
            },
          }),
        },
      },
      {
        name: "code",
        label: "Code",
        options: {
          filter: false,
          sort: false,
          display: true,
          setCellHeaderProps: () => ({
            style: {
              textAlign: "center",
              textDecoration: "bold",
              color: "#104e8b",
            },
          }),

          customBodyRender: (value) => {
            return (
              <Button
                onClick={() => {
                  this.handleOpenModal(value);
                }}
                style={{ color: "#104e8b" }}
              >
                {" "}
                View Your Code
              </Button>
            );
          },
        },
      },
    ];
    const options = {
      download: false,
      selectableRows: "none",
      viewColumns: false,
      setRowProps: (row) => {
        return {
          className: classnames({
            [this.props.classes.Successful]: row[2] === "AC",
            [this.props.classes.WA]: row[2] === "WA",
          }),
        };
      },
    };


    const data = this.state.list;

    return (
      <Layout>
        
      {this.state.loaded ? 
      <>
        <SecondaryNav />

        {/* <ReactModal
          style={{
            width: "50%",
            marginTop: "100px !important",
            border: "none !important",
            zIndex: 9999,
          }}
          border="none"
          margin="0"
          isOpen={this.state.showModal}
          contentLabel="Code basic viewer"
        >
          <div
            style={{
              margin: "40px auto",
              textAlign: "center",
              height: "0px",
              backgroundColor: "rgba(0,0,0,0)",
            }}
          >
            <div
              style={{
                margin: "20px auto",
                textAlign: "center",
                maxWidth: "900px",
              }}
            >
              <Button
                style={{ marginTop: "14px" }}
                onClick={this.handleCloseModal}
              >
                MINIMIZE
              </Button>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Memory&nbsp;(kb)</TableCell>
                      <TableCell align="center">Time&nbsp;(s)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.exec.map((row) => (
                      <TableRow>
                        <TableCell align="center">
                          {row.status.run_status}
                        </TableCell>
                        <TableCell align="center">
                          {row.status.memory_taken}
                        </TableCell>
                        <TableCell align="center">
                          {row.status.cpu_time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Card style={{ background: "black" }}>
                <Viewer value={this.state.view} lang={this.state.modallang} />
              </Card>
            </div>
          </div>
        </ReactModal> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={this.props.classes.modal}
        open={this.state.open}
        onClose={this.handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.state.open}>
          <div className={this.props.classes.paper}>
          <div
            style={{
              margin: "0px auto",
              textAlign: "center",
              height: "0px",
              backgroundColor: "rgba(0,0,0,0)",
            }}
          >
            <div
              style={{
                margin: "20px auto",
                textAlign: "center",
                maxWidth: "900px",
              }}
            >
              <Button
                style={{ marginTop: "0px" }}
                onClick={this.handleCloseModal}
              >
                MINIMIZE
              </Button>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Memory&nbsp;(kb)</TableCell>
                      <TableCell align="center">Time&nbsp;(s)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.exec.map((row) => (
                      <TableRow>
                        <TableCell align="center">
                          {row.status.run_status}
                        </TableCell>
                        <TableCell align="center">
                          {row.status.memory_taken}
                        </TableCell>
                        <TableCell align="center">
                          {row.status.cpu_time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Card style={{ background: "black" }}>
                <Viewer value={this.state.view} lang={this.state.modallang} />
              </Card>
            </div>
          </div>
          </div>
        </Fade>
      </Modal>
        <div
          className="contain"
          style={{
            maxWidth: "1000px",
            width: "100%",
            color: "#104e8b",
            position: "relative",
            marginBottom: "100px",
          }}
        >
          <Paper
            elevation={0}
            style={{
              backgroundColor: "#eeeeff",
              position: "relative",
              color: "#104e8b",
            }}
          >
            {" "}
            <MUIDataTable
              title={"Your Submissions"}
              data={data}
              columns={columns}
              options={options}
              elevation={0}
              color={"#104e8b"}
            />
          </Paper>
        </div>
        <div className="Footer">
          &copy; Created and maintained by GNU/Linux Users' group, Nit Durgapur
        </div>
        </>
        : <Loader />}
      </Layout>
    );
  }
}

export default withStyles(customStyles)(submissions);
