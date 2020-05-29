import React from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { } from "@material-ui/icons";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper} from '@material-ui/core';
import { withStyles, createStyles, Theme, } from "@material-ui/core/styles";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    body: {
      fontSize: 14
    }
  })
)(TableCell);

interface IProps {
    classes: any;
}

class Leaderboard extends React.Component<IProps, {}> {
    state = {
        gotData: false,
        leaderBoard: []
    }
    componentDidMount() {
        // axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard?format=json`).then(data => {
            axios.get(`https://ojapi.trennds.com/api/leaderboard?format=json`).then(data => {
                 this.setState({gotData: true, leaderBoard: data.data})
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
        return (       
        <Layout>
        <TableContainer component={Paper}>
            <Table  stickyHeader aria-label="simple table">
            <TableHead>
                <TableRow>
                    <StyledTableCell>Rank</StyledTableCell>
                    <StyledTableCell>USER</StyledTableCell>
                    <StyledTableCell>Score</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>{
                this.state.leaderBoard.map((user, index) => {
                    return(
                    <tr>
                    <TableCell>
                        <Typography variant="body1" >
                            <strong>{index+1}</strong>
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body1" >
                            <strong>{user.name.toUpperCase()}</strong>
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body1" color="secondary">
                            <strong>{user.score}</strong>
                        </Typography>
                    </TableCell>
                    </tr>
                )})
            }
            </TableBody>
            </Table>
        </TableContainer>
        </Layout>
        )
    }
}

export default Leaderboard;