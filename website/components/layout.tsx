import React from "react";
import {} from "@material-ui/icons";
//import Navbar from "./Navbar";
import Newappbar from "./newAppbar";

function Layout(props) {
  
    return (
      <React.Fragment>
        <Newappbar />
        {props.children}
      </React.Fragment>
    );
  }

export default Layout;
