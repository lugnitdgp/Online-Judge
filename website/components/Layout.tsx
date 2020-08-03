import React from "react";
import {} from "@material-ui/icons";
//import Navbar from "./Navbar";
import Newappbar from "./Newappbar";

class Layout extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Newappbar />
        {this.props.children}
        <div
          style={{
            position: "fixed",
            bottom: "0",
            height: "40px",
            width: "100%",
            backgroundColor: "#3344ff",
            textAlign: "center",
            color: "#fff",
            textTransform: "uppercase",
            fontSize: "10px",
            paddingTop: "14px",
            zIndex: 9999,
          }}
        >
          Created and maintained by GNU/Linux Users' group, Nit Durgapur
        </div>
      </React.Fragment>
    );
  }
}

export default Layout;
