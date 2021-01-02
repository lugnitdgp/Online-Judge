import React, { useState } from "react";
import Layout from "../components/layout";
import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import { useEffect } from "react";
import SecondaryNav from "../components/secondaryNav";
import Loader from "../components/loading";

//Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getSubmissionsData } from "../store/actions/submissionsAction";

const customStyles = makeStyles(() => ({
  Successful: {
    "& td": { backgroundColor: "#99ff99" },
  },
  WA: {
    "& td": { backgroundColor: "#ff6961" },
  },
}));

export default function submissions() {
  const classes = customStyles();
  const dispatch = useDispatch();
  const { submissions } = useSelector((state) => state.submissionsReducer);
  const { loaded } = useSelector((state) => state.submissionsReducer);
  useEffect(() => {
    dispatch(getSubmissionsData());
  }, []);

  const [loadedState, setLoaded] = useState(false);
  const [data, setData] = useState([]);

  if (submissions.length !== data.length || loadedState != loaded) {
    setLoaded(false);
    setData(submissions);
    setLoaded(loaded);
  } else if (
    submissions.length === 0 &&
    loaded === true &&
    loadedState === false
  ) {
    setData(submissions);
    setLoaded(loaded);
  }

  const columns = [
    {
      name: "isFail",
      label: " ",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            maxWidth: 5,
            color: "#fff",
            textAlign: "center",
            textDecoration: "bold",
          },
        }),

        setCellProps: () => ({
          style: {
            fontWeight: "bolder",
            maxWidth: 25,
            fontSize: 15,
            textAlign: "center",
            color: "#104e8b",
          },
        }),
      },
    },
    {
      name: "user",
      label: "  USER",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            color: "#fff",
            textAlign: "center",
            textDecoration: "bold",
          },
        }),

        setCellProps: () => ({
          style: {
            fontWeight: "bolder",
            fontSize: 15,
            textAlign: "center",
            color: "#104e8b",
          },
        }),
      },
    },
    {
      name: "problem",
      label: "PROBLEM",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            color: "#fff",
            textAlign: "center",
            fontWeight: "bolder",
          },
        }),

        setCellProps: () => ({
          style: { fontSize: 15, textAlign: "center", color: "#104e8b" },
        }),
      },
    },

    {
      name: "status",
      label: "STATUS",
      options: {
        filter: true,
        sort: false,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            color: "#fff",
            textAlign: "center",
          },
        }),

        setCellProps: () => ({
          style: { fontSize: 14, textAlign: "center", color: "#104e8b" },
        }),
      },
    },
    {
      name: "time",
      label: "TIME",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            color: "#fff",
            textDecoration: "bold",
          },
        }),

        setCellProps: () => ({
          style: {
            fontWeight: "bolder",
            fontSize: 14,
            color: "#104e8b",
          },
        }),
      },
    },
    {
      name: "memory",
      label: "MEMORY",
      options: {
        filter: false,
        sort: true,
        setCellHeaderProps: () => ({
          style: {
            background: "#104e8b",
            color: "#fff",
            textDecoration: "bold",
          },
        }),

        setCellProps: () => ({
          style: {
            fontWeight: "bolder",
            fontSize: 14,
            color: "#104e8b",
          },
        }),
      },
    },
  ];
  const options = {
    download: false,
    selectableRows: "none",
    viewColumns: false,
    setRowProps: (row) => {
      return {
        className: classnames({
          [classes.Successful]: row[3] === "AC",
          [classes.WA]: row[3] === "WA",
        }),
      };
    },
  };
  return (
    <Layout>
      {loadedState ? (
        <>
          <SecondaryNav />
          <div className="submissionsTableWrap">
            <MUIDataTable
              title={"Submissions"}
              data={data}
              columns={columns}
              options={options}
              style={{ fontSize: "16px", margin: "0 auto" }}
            />
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
  );
}
