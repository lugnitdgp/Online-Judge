import React from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import {} from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';
import { Avatar, Card } from '@material-ui/core';

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
			.get(`https://ojapi.trennds.com/api/leaderboard?format=json`)
			.then((data) => {
				data.data.map((entry) => {
					entry[`image`] = <Avatar src={entry[`image`]} />;
				});
				this.setState({ gotData: true, leaderBoard: data.data });
			})
			.catch(function(error) {
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
			viewColumns: false
		};
		const data = this.state.leaderBoard;

		return (
			<div>
				<Layout>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<Card
						style={{
							maxWidth: '700px',
							height: '70px',
							textAlign: 'center',
							margin: '20px auto'
						}}
					>
						<h1
							style={{
								margin: '12px auto',
								textTransform: 'uppercase',
								color: '#001144'
							}}
						>
							Leaderboard
						</h1>
					</Card>
					<div className="contain" style={{ margin: '0 auto', maxWidth: '900px', width: '100%' }}>
						<Card elevation={3} style={{ msOverflowX: 'scroll', margin: '0 auto' }}>
							<MUIDataTable title={'STANDINGS'} data={data} columns={columns} options={options} />
						</Card>
					</div>
				</Layout>
			</div>
		);
	}
}

export default Leaderboard;
