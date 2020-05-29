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

  state = {
    gotData: false,
    list: []
  }
  componentDidMount() {
    fetch(`https://ojapi.trennds.com/api/questions?json`, {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => this.setState({ list: res }))
      .catch((error) => {
         console.log(error);
      });
  }

  render() {
    const columns = [
      {
        Header: "USER",
        accessor: "user",
        headerClassName: "headerTable",
        className: "firstColumn"
      },
      {
        Header: "PROBLEM",
        accessor: "problem",
        headerClassName: "headerTable"
      },
      {
        Header: "LANGUAGE",
        accessor: "language",
        headerClassName: "headerTable"
      },
      {
        Header: "STATUS",
        accessor: "status",
        headerClassName: "headerTable"
      },
      {
        Header: "TIME",
        accessor: "time",
        headerClassName: "headerTable"
      },
      {
        Header: "MEMORY",
        accessor: "memory",
        headerClassName: "headerTable"
      }
    ];

    return (
      <Layout>
      <div>
        <ReactTable style={tableStyle}
         data={[1, 2, 3, 4,5]} 
         columns={columns}
         defaultPageSize={20}
         className="-striped -highlight"
         />
      </div>
      </Layout>
    );
  }
}
