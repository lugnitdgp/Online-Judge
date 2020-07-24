import React from "react";
import Layout from "../components/Layout";
import MUIDataTable from "mui-datatables";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Viewer from "components/CodeViewer";
import { Card } from "@material-ui/core";
import ReactModal from "react-modal";
import { Button } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const customStyles = () => ({
  Successful: {
    "& td": { backgroundColor: "#99ff99" },
  },
  WA: {
    "& td": { backgroundColor: "#ff6961" },
  },
});

interface IProps {
  classes: any;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

class submissions extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    list: [],
    showModal: false,
    view: "",
  };
  constructor(props: Readonly<IProps>) {
    super(props);

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal(data) {
    console.log(data);
    this.setState({ view: data, showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
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
        console.log(res);
        var arr = [];
        res.map((r) => {
          var stat = "";
          var time = "";
          var mem = "";
          console.log(r);
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

          var payload = {
            user: r.name,
            problem: r.question_name,
            status: stat,
            time: time,
            memory: mem,
            code: r.code,
          };

          arr.push(payload);
        });
        this.setState({ list: arr });
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
            style: { textAlign: "left", textDecoration: "bold" },
          }),

          setCellProps: () => ({
            style: { fontWeight: "bolder", fontSize: 15, textAlign: "left" },
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
            style: { textAlign: "center", fontWeight: "bolder" },
          }),

          setCellProps: () => ({
            style: { fontSize: 20, textAlign: "center" },
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
            style: { textAlign: "center" },
          }),

          setCellProps: () => ({
            style: { fontSize: 20, textAlign: "center" },
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
            style: { textAlign: "center", textDecoration: "bold" },
          }),

          setCellProps: () => ({
            style: { fontWeight: "bolder", fontSize: 17, textAlign: "center" },
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
            style: { textAlign: "center", textDecoration: "bold" },
          }),

          setCellProps: () => ({
            style: { fontWeight: "bolder", fontSize: 17, textAlign: "center" },
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
            style: { textAlign: "center", textDecoration: "bold" },
          }),

          customBodyRender: (value) => {
            return (
              <Button
                onClick={() => {
                  this.handleOpenModal(value);
                }}
              >
                {" "}
                TEST
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
        <ReactModal
          style={{
            width: "50%",
            marginTop: "100px !important",
            border: "none !important",
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
                      <TableCell>Dessert (100g serving)</TableCell>
                      <TableCell align="right">Calories</TableCell>
                      <TableCell align="right">Fat&nbsp;(g)</TableCell>
                      <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                      <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Card style={{ background: "black" }}>
                <Viewer value={this.state.view} lang="c++" />
              </Card>
            </div>
          </div>
        </ReactModal>

        <div
          className="contain"
          style={{ margin: "0 auto", maxWidth: "1000px", width: "100%" }}
        >
          <Paper elevation={3}>
            {" "}
            <MUIDataTable
              title={"Your Submissions"}
              data={data}
              columns={columns}
              options={options}
            />
          </Paper>
        </div>
      </Layout>
    );
  }
}

export default withStyles(customStyles)(submissions);
