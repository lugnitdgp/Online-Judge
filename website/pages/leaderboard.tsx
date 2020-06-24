import React from "react";
import axios from "axios";
import Layout from "../components/Layout";
import {} from "@material-ui/icons";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Card,
} from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 20,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);
interface IProps {
  classes: any;
}
class Leaderboard extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    leaderBoard: [],
  };

  componentDidMount() {
    // axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard?format=json`).then(data => {
    axios
      .get(`https://ojapi.trennds.com/api/leaderboard?format=json`)
      .then((data) => {
        this.setState({ gotData: true, leaderBoard: data.data });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  render() {
    interface Column {
      id: "rank" | "image" | "name" | "score";
      label: string;
      minWidth?: number;
      align?: "right" | "center" | "left";
      format?: (value: number) => string;
    }
    const columns: Column[] = [
      { id: "rank", align: "center", label: "Rank", minWidth: 100 },
      { id: "image", label: "", align: "left", minWidth: 10 },
      { id: "name", align: "left", label: "User", minWidth: 100 },
      { id: "score", align: "center", label: "Score", minWidth: 100 },
    ];

    return (
      <div>
        <Layout>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <Card
            style={{
              maxWidth: "700px",
              height: "70px",
              textAlign: "center",
              margin: "20px auto",
            }}
          >
            <h1
              style={{
                margin: "12px auto",
                textTransform: "uppercase",
                color: "#001144",
              }}
            >
              Leaderboard
            </h1>
          </Card>
          <div
            className="contain"
            style={{ margin: "0 auto", maxWidth: "900px", width: "100%" }}
          >
            <Card
              elevation={3}
              style={{ msOverflowX: "scroll", margin: "0 auto" }}
            >
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <StyledTableCell
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                            backgroundColor: "#001144",
                          }}
                        >
                          <strong>{column.label}</strong>
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {this.state.leaderBoard.map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.id === "image" ? (
                                  <Avatar alt={row.name} src={value} />
                                ) : (
                                  <strong>{value}</strong>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </div>
        </Layout>
      </div>
    );
  }
}

export default Leaderboard;
