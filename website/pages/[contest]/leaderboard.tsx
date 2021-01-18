import React, { useState } from "react";
import Layout from "../../components/layout";
import {} from "@material-ui/icons";
import { Avatar, Card } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import SecondaryNav from "../../components/secondaryNav";
import Loader from "../../components/loading";
import { useEffect } from "react";
import { useRouter } from 'next/router'


//Redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  getLearderboardDataQues,
} from "../../store/actions/leaderboardAction";

export default function Leaderboard() {
  const dispatch = useDispatch();
  const { leaderboard } = useSelector((state) => state.leaderboardReducer);
  const { loaded } = useSelector((state) => state.leaderboardReducer);
  const { data } = useSelector((state) => state.leaderboardReducer);
  useEffect(() => {
    dispatch(getLearderboardDataQues())    
  }, []);

  const router = useRouter()
  const { contest } = router.query

  useEffect(() => {
    if (!localStorage.token) window.location.href = "/";
      localStorage.setItem("code", contest.toString());
    })


  const [loadedState, setLoaded] = useState(false);
  const [Leaderboard, setLeaderboard] = useState([]);
  const [Data, setData] = useState([]);

  if (
    JSON.stringify(Leaderboard) !== JSON.stringify(leaderboard) ||
    loadedState != loaded
  ) {
    setLeaderboard(leaderboard);
    setLoaded(loaded);
  }

  if (data.length !== Data.length) {
    // console.log(data);
    data.map((entry) => {
      // console.log(entry);
      entry[`image`] = <Avatar src={entry[`image`]}></Avatar>;
      var answers = entry.answer;
      answers.map((answer) => {
        // console.log(answer);
        entry[`${answer.ques_name}`] = [
          answer.correct,
          answer.wrong,
          answer.score,
        ];
      });

      Leaderboard.map((column) => {
        if (!entry.hasOwnProperty(column.name)) entry[column.name] = " ";
      });
    });
    // console.log(data);
    setData(data);
    setLoaded(loaded);
  }

  // console.log(Data);

  const options = {
    download: false,
    selectableRows: "none",
    viewColumns: false,
    page: 0,
    rowsPerPage: 10,
  };

  const handleChangePage = () => {
    options.page = options.page + 1;
  };

  const handleChangeRowsPerPage = () => {
    options.rowsPerPage = +event.target;
  };

  return (
    <div>
      <Layout>
        {loadedState ? (
          <>
            <SecondaryNav />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <div className="leaderboardHeadWrapper">
              <h1 className="leaderboardHead">Leaderboard</h1>
            </div>
            <div className="leaderboardTableWrapper">
              <Card elevation={0} className="leaderboardCard">
                <Paper>
                  <TableContainer className="leaderboardTableContainer">
                    {}
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {Leaderboard.map((columns) => (
                            <TableCell
                              key={columns.name}
                              align="left"
                              className="leaderboardTableCell"
                            >
                              {columns.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Data.slice(
                          options.page * options.rowsPerPage,
                          options.page * options.rowsPerPage +
                            options.rowsPerPage
                        ).map((row) => {
                          // console.log(row);
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.name}
                            >
                              {Leaderboard.map((columns) => {
                                const value = row[columns.name];
                                if (Array.isArray(value)) {
                                  if (value[0] == 0) {
                                    return (
                                      <TableCell
                                        key={columns.name}
                                        className="leaderboardTableCellRed"
                                      >
                                        -{value[1]}
                                      </TableCell>
                                    );
                                  } else if (value[0] == 1) {
                                    return (
                                      <TableCell
                                        key={columns.name}
                                        className="leaderboardTableCellGreen"
                                      >
                                        {value[2]}
                                      </TableCell>
                                    );
                                  }
                                } else {
                                  return (
                                    <TableCell
                                      key={columns.name}
                                      className="leaderboardTableCellWhite"
                                    >
                                      {value}
                                    </TableCell>
                                  );
                                }
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={Leaderboard.length}
                    rowsPerPage={options.rowsPerPage}
                    page={options.page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    className="leaderboardPagination"
                  />
                </Paper>
              </Card>
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
    </div>
  );
}
