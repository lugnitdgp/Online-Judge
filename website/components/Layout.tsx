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
        <div className="Footer">
          &copy; Created and maintained by GNU/Linux Users' group, Nit Durgapur
        </div>
      </React.Fragment>
    );
  }
}

export default Layout;
