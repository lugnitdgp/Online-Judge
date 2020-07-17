import React from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { } from '@material-ui/icons';
//import MUIDataTable from 'mui-datatables';
import { Avatar, Card } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
interface IProps {
	classes: any;
}
class Leaderboard extends React.Component<IProps, {}> {
	state = {
		gotData: false,
		leaderBoard: []
	};

	componentDidMount() {
		// axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard?format=json`).then(data => {
		axios
			.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard?contest_id=${localStorage.code}`)
			.then((data) => {
				data.data.map((entry) => {
					entry[`image`] = <Avatar src={entry[`image`]} />;
				});
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
		const columns = [
			{
				name: 'rank',
				label: 'RANK',
				options: {
					filter: false,
					sort: false,
					setCellHeaderProps: () => ({
						style: { textAlign: 'center', background: '#000', color: '#fff', textDecoration: 'bold' }
					}),
					setCellProps: () => ({
						style: { fontWeight: '900', textAlign: 'center' }
					})
				}
			},
			{
				name: 'image',
				label: ' ',
				options: {
					filter: false,
					sort: false,
					setCellHeaderProps: () => ({
						style: { background: '#000', color: '#fff', textDecoration: 'bold' }
					})
				}
			},
			{
				name: 'name',
				label: 'NAME',
				options: {
					filter: true,
					sort: false,
					setCellHeaderProps: () => ({
						style: { textAlign: 'center', background: '#000', color: '#fff', textDecoration: 'bold' }
					}),
					setCellProps: () => ({
						style: { fontWeight: '900', textAlign: 'center' }
					})
				}
			},
			{
				name: 'score',
				label: 'SCORE',
				options: {
					filter: true,
					sort: false,
					setCellHeaderProps: () => ({
						style: { textAlign: 'center', background: '#000', color: '#fff', textDecoration: 'bold' }
					}),
					setCellProps: () => ({
						style: { fontWeight: '900', textAlign: 'center' }
					})
				}
			}
		];
		const options = {
			download: false,
			selectableRows: 'none',
			viewColumns: false,
			page: 0,
			rowsPerPage: 10,
		};
		const data = this.state.leaderBoard;
		const handleChangePage = () => {
			options.page = options.page + 1;
		};

		const handleChangeRowsPerPage = () => {
			options.rowsPerPage = (+event.target);

		};
		return (
			<div>
				<Layout>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<div
						style={{
							maxWidth: '700px',
							height: '30px',
							textAlign: 'center',
							margin: '20px auto',
							padding: "0px"
						}}
					>
						<h1
							style={{
								margin: '0px auto',
								textTransform: 'uppercase',
								color: '#001144'
							}}
						>
							Leaderboard
						</h1>
					</div>
					<div className="contain" style={{ margin: '0 auto', maxWidth: '900px', width: '100%' }}>
						<Card elevation={0} style={{ msOverflowX: 'scroll', margin: '0 auto', border: "1px solid #003" }}>
							{/* <MUIDataTable title={'STANDINGS'} data={data} columns={columns} options={options} /> */}
							<Paper>
								<TableContainer>
									<Table stickyHeader aria-label="sticky table">
										<TableHead>
											<TableRow >
												{columns.map((columns) => (
													<TableCell
														key={columns.name}
														align="left"
														style={{ backgroundColor: "#eeeeff", color: "#003", fontSize: "15px" }}
													>
														{columns.label}
													</TableCell>
												))}
											</TableRow>
										</TableHead>
										<TableBody>
											{data.slice(options.page * options.rowsPerPage, options.page * options.rowsPerPage + options.rowsPerPage).map((row) => {
												return (
													<TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
														{columns.map((columns) => {
															const value = row[columns.name];
															return (
																<TableCell key={columns.name} style={{ minWidth: "20px", backgroundColor: "#eeeeff", color: "#003", fontSize: "13px", borderBottom: "0px solid #006", paddingTop: "7px", paddingBottom: "7px" }}>
																	{value}
																</TableCell>
															);
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
									style={{ backgroundColor: "#eeeeff", borderTop: "1px solid #ddd" }}
								/>
							</Paper>
						</Card>
					</div>
				</Layout>
			</div>
		);
	}
}

export default Leaderboard;
