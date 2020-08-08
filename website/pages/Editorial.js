import React from "react";
import Layout from "../components/Layout";

class Editorial extends React.Component {
    render() {
      return (
        <Layout>
            <div style={{margin:"50px auto",width:"90%", maxWidth:"1000px", textAlign:"left", padding:"30px", borderRadius:"20px", border:"2px solid #104E8B", borderTop:"10px solid #104E8B", borderBottom:"10px solid #104E8B", color:"#104E8B"}}>
                <h3>Contest Name</h3>
                <br/>
                <h4>Question name</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <br/>
                <h4>Solution</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <h4>code</h4>
            </div>
            <div className="Footer">
              &copy; Created and maintained by GNU/Linux Users' group, Nit
              Durgapur
            </div>
        </Layout>
          
        
      );
    }
  }
  
  export default Editorial;