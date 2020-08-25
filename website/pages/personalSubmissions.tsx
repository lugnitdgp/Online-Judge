import React, { useState } from "react";
import Layout from "../components/layout";
import MUIDataTable from "mui-datatables";
import Paper from "@material-ui/core/Paper";
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
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Loader from "../components/loading";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";

//Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getPersonalSubmissionsData } from "../store/actions/personalSubmissionsAction";

const useStyles = makeStyles(() => ({
  Successful: {
    "& td": { backgroundColor: "#99ff99" },
  },
  WA: {
    "& td": { backgroundColor: "#ff6961" },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "#fff",
    border: "2px solid #104e8b",
    borderTop: "10px solid #104e8b",
    borderBottom: "10px solid #104e8b",
    outline: "none",
    padding: "30px",
    borderRadius: "20px",
    minWidth: "70%",
    minHeight: "90%",
    color: "#104e8b",
    overflow: "auto",
  },
}));

export default function personalSubmissions() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { personal_submissions } = useSelector(
    (state) => state.personalSubmissionsReducer
  );
  const { loaded } = useSelector((state) => state.personalSubmissionsReducer);
  useEffect(() => {
    dispatch(getPersonalSubmissionsData());
  }, []);

  const [loadedState, setLoaded] = useState(false);
  const [Psubmissions, setPsubmissions] = useState([]);
  const [open, setOpen] = useState(false);
  const [modallang, setModallang] = useState("");
  const [view, setView] = useState("");
  const [exec, setExec] = useState([]);

  if (personal_submissions.length !== Psubmissions.length || loadedState!=loaded ) {
    setLoaded(false);
    setPsubmissions(personal_submissions);
    setLoaded(loaded);
  } else if (
    personal_submissions.length === 0 &&
    loaded === true &&
    loadedState === false
  ) {
    setPsubmissions(personal_submissions);
    setLoaded(loaded);
  }

  const handleOpenModal = (data) => {
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

    setView(data.source);
    setModallang(data.lang);
    setExec(data.testcases);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
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
                handleOpenModal(value);
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
          [classes.Successful]: row[2] === "AC",
          [classes.WA]: row[2] === "WA",
        }),
      };
    },
  };

  const data = Psubmissions;

  return (
    <Layout>
      {loadedState ? (
        <>
          <SecondaryNav />

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
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
                      onClick={handleCloseModal}
                    >
                      MINIMIZE
                    </Button>
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">
                              Memory&nbsp;(kb)
                            </TableCell>
                            <TableCell align="center">Time&nbsp;(s)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {exec.map((row) => (
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
                      <Viewer value={view} lang={modallang} />
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
            &copy; Created and maintained by GNU/Linux Users' group, Nit
            Durgapur
          </div>
        </>
      ) : (
        <Loader />
      )}
    </Layout>
  );
}
