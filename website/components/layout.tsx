import React from "react";
import {} from "@material-ui/icons";
//import Navbar from "./Navbar";
import Newappbar from "./newAppbar";

class Layout extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Newappbar />
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default Layout;
