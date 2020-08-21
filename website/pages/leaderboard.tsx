import React from "react";
import axios from "axios";
import Layout from "../components/layout";
import {} from "@material-ui/icons";
//import MUIDataTable from 'mui-datatables';
import { Avatar, Card } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import SecondaryNav from "../components/secondaryNav";
import Loader from "../components/loading";

interface IProps {
  classes: any;
}
class Leaderboard extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    leaderBoard: [],
    columns: [],
    loaded:false,
  };

  componentDidMount() {
    var columns = [
      {
        name: "rank",
        label: "RANK",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => ({
            style: {
              textAlign: "center",
              background: "#000",
              color: "#fff",
              textDecoration: "bold",
            },
          }),
          setCellProps: () => ({
            style: { fontWeight: "900", textAlign: "center" },
          }),
        },
      },
      {
        name: "image",
        label: " ",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => ({
            style: {
              background: "#000",
              color: "#fff",
              textDecoration: "bold",
            },
          }),
        },
      },
      {
        name: "name",
        label: "NAME",
        options: {
          filter: true,
          sort: false,
          setCellHeaderProps: () => ({
            style: {
              textAlign: "center",
              background: "#000",
              color: "#fff",
              textDecoration: "bold",
            },
          }),
          setCellProps: () => ({
            style: { fontWeight: "900", textAlign: "center" },
          }),
        },
      },{
        name: "score",
        label: "SCORE",
        options: {
          filter: true,
          sort: false,
          setCellHeaderProps: () => ({
            style: {
              textAlign: "center",
              background: "#000",
              color: "#fff",
              textDecoration: "bold",
            },
          }),
          setCellProps: () => ({
            style: { fontWeight: "900", textAlign: "center" },
          }),
        },
      }
    ];

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions?contest_id=${localStorage.code}`,
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
        res.map((ques) => {
          var newCol = {
            name: `${ques.question_name}`,
            label: `${ques.question_name}`,
            options: {
              filter: false,
              sort: false,
              setCellHeaderProps: () => ({
                style: {
                  textAlign: "center",
                  background: "#000",
                  color: "#fff",
                  textDecoration: "bold",
                },
              }),
              setCellProps: () => ({
                style: { fontWeight: "900", textAlign: "center" },
              }),
            },
          };

          columns.push(newCol);
        });
        this.setState({ columns: columns });
      })
      .then(() => {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard?contest_id=${localStorage.code}`
          )
          .then((data) => {
            console.log(data.data);
            data.data.map((entry) => {
              entry[`image`] = <Avatar src={entry[`image`]} />;
              var answers = entry.answer;
              answers.map((answer) => {
                console.log(answer)
                entry[`${answer.ques_name}`] = [answer.correct, answer.wrong, answer.score];
              })
              
              this.state.columns.map((column)=>{
                  if(!entry.hasOwnProperty(column.name))
                      entry[column.name] = " "
              })

            });
            this.setState({ gotData: true, leaderBoard: data.data, loaded: true });
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error);
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          });
      });
  }

  render() {
    const columns = this.state.columns;
    const options = {
      download: false,
      selectableRows: "none",
      viewColumns: false,
      page: 0,
      rowsPerPage: 10,
    };
    const data = this.state.leaderBoard;
    const handleChangePage = () => {
      options.page = options.page + 1;
    };

    const handleChangeRowsPerPage = () => {
      options.rowsPerPage = +event.target;
    };
    return (
      <div>
        <Layout>
      {this.state.loaded ? 
      <>
          <SecondaryNav />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <div
            style={{
              maxWidth: "700px",
              height: "30px",
              textAlign: "center",
              margin: "20px auto",
              padding: "0px",
            }}
          >
            <h1
              style={{
                margin: "0px auto",
                textTransform: "uppercase",
                color: "#001144",
              }}
            >
              Leaderboard
            </h1>
          </div>
          <div
            className="contain"
            style={{
              padding: "1px",
              maxWidth: "900px",
              width: "100%",
              position: "relative",
            }}
          >
            <Card
              elevation={0}
              style={{
                msOverflowX: "scroll",
                border: "2px solid #104e8b",
                marginBottom: "30px",
              }}
            >
              {/* <MUIDataTable title={'STANDINGS'} data={data} columns={columns} options={options} /> */}
              <Paper>
                <TableContainer style={{ position: "relative" }}>
                  {}
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((columns) => (
                          <TableCell
                            key={columns.name}
                            align="left"
                            style={{
                              backgroundColor: "#fff",
                              color: "#104e8b",
                              fontSize: "15px",
                            }}
                          >
                            {columns.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data
                        .slice(
                          options.page * options.rowsPerPage,
                          options.page * options.rowsPerPage +
                            options.rowsPerPage
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.name}
                            >
                              {columns.map((columns) => {
                                const value = row[columns.name];
                                
                                  if(Array.isArray(value)){if(value[0]==0){return(<TableCell
                                    key={columns.name}
                                    style={{
                                      minWidth: "20px",
                                      backgroundColor: "#f25",
                                      color: "#000000",
                                      fontSize: "15px",
                                      borderBottom: "0px solid #006",
                                      paddingTop: "7px",
                                      paddingBottom: "7px",
                                    }}
                                  >
                                    -{value[1]}
                                  </TableCell>)}else if(value[0]==1){
                                    
                                    return(
                                      <TableCell
                                    key={columns.name}
                                    style={{
                                      minWidth: "20px",
                                      backgroundColor: "#98ff98",
                                      color: "#000000",
                                      fontSize: "15px",
                                      borderBottom: "0px solid #006",
                                      paddingTop: "7px",
                                      paddingBottom: "7px",
                                    }}
                                  >
                                    {value[2]}
                                  </TableCell>
                                    )
                                  }}else{return(<TableCell
                                    key={columns.name}
                                    style={{
                                      minWidth: "20px",
                                      backgroundColor: "#fff",
                                      color: "#104e8b",
                                      fontSize: "13px",
                                      borderBottom: "0px solid #006",
                                      paddingTop: "7px",
                                      paddingBottom: "7px",
                                    }}
                                  >
                                    {value}
                                  </TableCell>)}
                                  
                                
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
                  count={data.length}
                  rowsPerPage={options.rowsPerPage}
                  page={options.page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  style={{
                    backgroundColor: "#fff",
                    borderTop: "1px solid #ddd",
                  }}
                />
              </Paper>
            </Card>
          </div>
          <div className="Footer">
            &copy; Created and maintained by GNU/Linux Users' group, Nit
            Durgapur
          </div>
          </>
        : <Loader />}
        </Layout>
      </div>
    );
  }
}

export default Leaderboard;
