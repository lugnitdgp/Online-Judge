import React, { useState } from "react";
import dynamic from "next/dynamic";
import Layout from "../../components/layout";
import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import { useEffect } from "react";
import SecondaryNav from "../../components/secondaryNav";
import Loader from "../../components/loading";
import { useRouter } from 'next/router';
import { Button } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Fade from "@material-ui/core/Fade";
import { Card } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Paper from "@material-ui/core/Paper";

const Viewer = dynamic(import("components/codeViewer"), { ssr: false });

//Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getSubmissionsData } from "../../store/actions/submissionsAction";
import Footer from "components/footer";

const customStyles = makeStyles(() => ({
  Successful: {
    "& td": { backgroundColor: "#99ff99" },
  },
  WA: {
    "& td": { backgroundColor: "#ff6961" },
  },
}));

export default function submissions() {
  const classes = customStyles();
  const dispatch = useDispatch();
  const { submissions } = useSelector((state) => state.submissionsReducer);
  const { loaded } = useSelector((state) => state.submissionsReducer);
  useEffect(() => {
    dispatch(getSubmissionsData());
  }, []);

  const [loadedState, setLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [modallang, setModallang] = useState("");
  const [view, setView] = useState("");

  const router = useRouter()
  const { contest } = router.query

  useEffect(() => {
    if (!localStorage.token) window.location.href = "/";
    localStorage.setItem("code", contest.toString());
  })

  if (submissions.length !== data.length || loadedState != loaded) {
    setLoaded(false);
    setData(submissions);
    setLoaded(loaded);
  } else if (
    submissions.length === 0 &&
    loaded === true &&
    loadedState === false
  ) {
    setData(submissions);
    setLoaded(loaded);
  }

  const handleOpenModal = (data) => {
    setView(data[0]);
    setModallang(data[1]);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  var columns = [
    {
      name: "isFail",
      label: " ",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            maxWidth: 5,
            color: "#fff",
            textAlign: "center",
            textDecoration: "bold",
          },
        }),

        setCellProps: () => ({
          style: {
            fontWeight: "bolder",
            maxWidth: 25,
            fontSize: 15,
            textAlign: "center",
            color: "#104e8b",
          },
        }),
      },
    },
    {
      name: "user",
      label: "  USER",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            color: "#fff",
            textAlign: "center",
            textDecoration: "bold",
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
      name: "problem",
      label: "PROBLEM",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            color: "#fff",
            textAlign: "center",
            fontWeight: "bolder",
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
          style: {
            background: "#104e8b",
            color: "#fff",
            textAlign: "center",
          },
        }),

        setCellProps: () => ({
          style: { fontSize: 14, textAlign: "center", color: "#104e8b" },
        }),
      },
    },
    {
      name: "time",
      label: "TIME",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            color: "#fff",
            textDecoration: "bold",
          },
        }),

        setCellProps: () => ({
          style: {
            fontWeight: "bolder",
            fontSize: 14,
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
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            color: "#fff",
            textDecoration: "bold",
          },
        }),

        setCellProps: () => ({
          style: {
            fontWeight: "bolder",
            fontSize: 14,
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
            background: "#104e8b",
            color: "#fff",
            textDecoration: "bold",
          },
        }),
        setCellProps: () => ({
          style: {
            fontWeight: "bolder",
            fontSize: 14,
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
              View Code
            </Button>
          );
        },
      },
    },
  ];
  const options = {
    download: false,
    print: false,
    selectableRows: "none",
    viewColumns: false,
    setRowProps: (row) => {
      return {
        className: classnames({
          [classes.Successful]: row[3] === "AC",
          [classes.WA]: row[3] === "WA",
        }),
      };
    },
  };
  return (
    <Layout>
      {loadedState ? (
        <>
          <SecondaryNav />
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className="PSmodal"
            open={open}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className="PSpaper">
                <div className="PSmodelPaper">
                  <div className="PSmodelPaperInner">
                    <Button
                      className="PSmodalMinimizebtn"
                      onClick={handleCloseModal}
                    >
                      MINIMIZE
                    </Button>

                    <Card>

                        {
                          !view ? 
                          (<div className="RunningContestSubmission">
                              <h4>
                              You can view code after the contest ends
                              </h4>
                          </div>
                          )
                          :(<Viewer value={view} lang={modallang} />)
                        }
                    </Card>
                  </div>
                </div>
              </div>
            </Fade>
          </Modal>
          <div className="submissionsTableWrap">
            <MUIDataTable
              title={"Submissions"}
              data={data}
              columns={columns}
              options={options}
              style={{ fontSize: "16px", margin: "0 auto" }}
            />
          </div>
          <Footer />
        </>
      ) : (
          <Loader />
        )}
    </Layout>
  );
}
