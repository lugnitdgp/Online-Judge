import React from 'react';
import Layout from '../components/Layout';
import MUIDataTable from 'mui-datatables';
import Paper from '@material-ui/core/Paper';
import {withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {Card} from "@material-ui/core"

const customStyles = () => ({
	Successful: {
	  '& td': { backgroundColor: "#99ff99" }
	},
	WA: {
	  '& td': { backgroundColor: "#ff6961" }
	},
	
  });

interface IProps {
	classes: any;
}

class submissions extends React.Component<IProps, {}> {
	state = {
		gotData: false,
		list: []
    };
    
    nl2br (str) {
        var breakTag =  '<br/>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
     }


	componentDidMount() {
       var self = this
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/personalsubmissions?contest_id=${localStorage.code}`, {
			method: 'GET',
			headers: {
				Authorization: `Token ${localStorage.token}`
			}
		})
			.then((resp) => resp.json())
			.then((res) => {
				var arr = [];
				res.map((r)=>{
					var stat = ""
					var time = ""
					var mem = ""
                    const cases = JSON.parse(r.status)
                    var a= self.nl2br(r.code)
                    console.log(a)
					cases.map((testcase)=>{
							if(testcase.code == 1){
							stat = "Compilation Error"
							time ="NA"
							mem = "NA"
							}
							else{
								if(testcase.status.run_status == "AC"){
									if(stat == ""){
										stat ="AC"
										time = testcase.status.cpu_time + " sec"
										mem = testcase.status.memory_taken+" kb "

									}}
								else{
									stat = testcase.status.run_status
									time = testcase.status.cpu_time+" sec"
									mem = testcase.status.memory_taken+" kb"
								}
									

							}
						

					})

					

					

					var payload = {
						user : r.name,
						problem : r.question_name,
						status : stat,
						time : time,
                        memory: mem,
                        code: a}

					arr.push(payload)
					
				})
				this.setState({ list: arr });
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
					sort: false,
					setCellHeaderProps: () => ({
						style: {  textAlign : 'left',textDecoration: 'bold' }
					}),
					
					setCellProps: () =>({
						style: { fontWeight: 'bolder', fontSize:15,textAlign : 'left' }
					})
				}
			},
			{
				name: 'problem',
				label: 'PROBLEM',
				options: {
                    filter: false,
					sort: false,
					setCellHeaderProps: () => ({
						style: {  textAlign : 'center', fontWeight: 'bolder' }
					}),
					
					setCellProps: () =>({
						style: {fontSize:20,textAlign : 'center' }
					})
				}
			},
			
			{
				name: 'status',
				label: 'STATUS',
				options: {
					filter: true,
					sort: false,
					setCellHeaderProps: () => ({
						style: { textAlign : 'center'}
					}),
					
					setCellProps: () =>({
						style: {  fontSize:20,textAlign : 'center' }
					})
				}
			},
			{
				name: 'time',
				label: 'TIME',
				options: {
					filter: false,
					sort: false,
					setCellHeaderProps: () => ({
						style: { textAlign : 'center', textDecoration: 'bold' }
					}),
					
					setCellProps: () =>({
						style: { fontWeight: 'bolder', fontSize:17,textAlign : 'center' }
					})
				}
			},
			{
				name: 'memory',
				label: 'MEMORY',
				options: {
					filter: false,
					sort: false,
					setCellHeaderProps: () => ({
						style: { textAlign : 'center',textDecoration: 'bold' }
					}),
					
					setCellProps: () =>({
						style: { fontWeight: 'bolder', fontSize:17,textAlign : 'center' }
					})
				}
            },
            {
				name: 'code',
				label: ' ',
				options: {
					filter: false,
                    sort: false,
                    display:false,
					setCellHeaderProps: () => ({
						style: {maxWidth:1, textAlign : 'center',textDecoration: 'bold' }
					}),
					
					setCellProps: () =>({
						style: {maxWidth:1,fontWeight: 'bolder', fontSize:17,textAlign : 'center' }
					})
				}
			}
		];
		const options = {
			download: false,
			selectableRows: 'none',
            viewColumns: false,
            expandableRows: true,
            expandableRowsHeader: false,
            expandableRowsOnClick: true,
            setRowProps: (row) => {
				return {	
				  className: classnames(
					{
					  [this.props.classes.Successful]: row[2] === "AC",
					  [this.props.classes.WA]: row[2] === "WA"
					}),
				};
			  },
            
            isRowExpandable: (dataIndex, expandedRows) => {
              // Prevent expand/collapse of any row if there are 4 rows expanded already (but allow those already expanded to be collapsed)
              if (expandedRows.data.length > 4 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false;
              return true;
            },
            
            renderExpandableRow: (rowData) => {
              const colSpan = rowData.length + 1;                 
              return (
                <TableRow>
                  <TableCell colSpan={colSpan}>
                      <Card style={{background:'black', color:'white', fontWeight:'bolder', paddingTop:10 ,paddingLeft:20, paddingBottom:10}}>
                          <code>
                          <pre dangerouslySetInnerHTML={{ __html: `<div>${rowData[5]}</div>`  }} />
                          </code>
                            </Card>

                  </TableCell>
                </TableRow>
              );
            },
			
        }




    
        
        const data = this.state.list

        

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


export default withStyles(customStyles)(submissions)