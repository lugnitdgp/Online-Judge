import React from 'react';
import Layout from '../components/Layout';
import MUIDataTable from 'mui-datatables';
import Paper from '@material-ui/core/Paper';

interface IProps {
	classes: any;
}

export default class submissions extends React.Component<IProps, {}> {
	state = {
		gotData: false,
		list: []
	};
	componentDidMount() {
		fetch(`https://ojapi.trennds.com/api/questions?json`, {
			method: 'GET',
			headers: {
				Authorization: `Token ${localStorage.token}`
			}
		})
			.then((resp) => resp.json())
			.then((res) => {
				console.log(res);
				this.setState({ list: res });
			})
			.catch((error) => {
				console.log(error);
			});
	}

	render() {
		const columns = [
			{
				name: 'user',
				label: '  USER',
				options: {
					filter: false,
					sort: false
				}
			},
			{
				name: 'problem',
				label: 'PROBLEM',
				options: {
					filter: false,
					sort: false
				}
			},
			{
				name: 'language',
				label: 'LANGUAGE',
				options: {
					filter: true,
					sort: false
				}
			},
			{
				name: 'status',
				label: 'STATUS',
				options: {
					filter: true,
					sort: false
				}
			},
			{
				name: 'time',
				label: 'TIME',
				options: {
					filter: false,
					sort: true
				}
			},
			{
				name: 'memory',
				label: 'MEMORY',
				options: {
					filter: false,
					sort: true
				}
			}
		];
		const options = {
			download: false,
			selectableRows: 'none',
			viewColumns: false
		};
		const data = this.state.list;
		return (
			<Layout>
				<div className="contain" style={{ margin: '0 auto', maxWidth: '1000px', width: '100%' }}>
					<Paper elevation={3}>
						{' '}
						<MUIDataTable title={'Submissions'} data={data} columns={columns} options={options} />
					</Paper>
				</div>
			</Layout>
		);
	}
}
