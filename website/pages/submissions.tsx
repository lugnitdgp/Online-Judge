import React from "react";
import ReactTable from "react-table-6";
import Layout from '../components/Layout';

const tableStyle = {
  border: "none",
  boxShadow: "none"
};

interface IProps {
  classes: any;
}

export default class submissions extends React.Component <IProps, {}> {
  componentDidMount() { }
  render() {
    const columns = [
      {
        Header: "user",
        accessor: "user",
        headerClassName: "headerTable",
        className: "firstColumn"
      },
      {
        Header: "problem",
        accessor: "problem",
        headerClassName: "headerTable"
      },
      {
        Header: "language",
        accessor: "language",
        headerClassName: "headerTable"
      },
      {
        Header: "status",
        accessor: "status",
        headerClassName: "headerTable"
      },
      {
        Header: "time",
        accessor: "time",
        headerClassName: "headerTable"
      },
      {
        Header: "memory",
        accessor: "memory",
        headerClassName: "headerTable"
      }
    ];

    // const { classes } = this.props;
    return (
      <Layout>
      <div>
        <ReactTable style={tableStyle}
         data={[1, 2, 3, 4]} 
         columns={columns}
         defaultPageSize={20}
         className="-striped -highlight"
         />
      </div>
      </Layout>
    );
  }
}
