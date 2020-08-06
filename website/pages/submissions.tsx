import React from "react";
import Layout from "../components/Layout";
import MUIDataTable from "mui-datatables";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import CloseTwoToneIcon from "@material-ui/icons/CloseTwoTone";
import SecondaryNav from "../components/SecondaryNav";

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

class submissions extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    list: [],
  };
  componentDidMount() {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions?contest_id=${localStorage.code}`,
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
          var isFail = false;
          var sign;
          const cases = JSON.parse(r.status);
          cases.map((testcase) => {
            if (testcase.code == 1) {
              stat = "Compilation Error";
              isFail = true;
              time = "NA";
              mem = "NA";
            } else {
              if (testcase.status.run_status == "AC") {
                if (stat == "") {
                  stat = "AC";
                  isFail = false;
                  time = testcase.status.cpu_time + " sec";
                  mem = testcase.status.memory_taken;
                }
              } else {
                stat = testcase.status.run_status;
                isFail = true;
                time = testcase.status.cpu_time + " sec";
                mem = testcase.status.memory_taken;
              }
            }
            if (isFail == true) sign = <CloseTwoToneIcon />;
            else sign = <CheckTwoToneIcon />;
          });

          var payload = {
            user: r["name"],
            problem: r.question,
            status: stat,
            time: time,
            memory: mem,
            isFail: sign,
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
    ];
    const options = {
      download: false,
      selectableRows: "none",
      viewColumns: false,
      setRowProps: (row) => {
        return {
          className: classnames({
            [this.props.classes.Successful]: row[3] === "AC",
            [this.props.classes.WA]: row[3] === "WA",
          }),
        };
      },
    };
    const data = this.state.list;
    return (
      <Layout>
        <SecondaryNav />
        <div
          className="contain"
          style={{
            maxWidth: "1000px",
            width: "100%",
            fontSize: "16px",
            position: "relative",
            marginBottom: "50px",
            marginTop: "10px",
          }}
        >
          <MUIDataTable
            title={"Submissions"}
            data={data}
            columns={columns}
            options={options}
            style={{ fontSize: "16px" }}
          />
        </div>
      </Layout>
    );
  }
}

export default withStyles(customStyles)(submissions);
