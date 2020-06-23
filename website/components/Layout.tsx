import React from "react";
import {} from "@material-ui/icons";
//import Navbar from "./Navbar";
import Newappbar from "./Newappbar";
import Clock from "react-live-clock";

class Layout extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Newappbar />
        {this.props.children}

        <Clock format="HH:mm:ss" interval={1000} ticking={true} />
      </React.Fragment>
    );
  }
}

export default Layout;
