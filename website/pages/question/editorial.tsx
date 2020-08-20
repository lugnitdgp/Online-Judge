import React from "react";
import Layout from "../../components/Layout";
import Loader from "../../components/loading";
import Viewer from "components/CodeViewer";

interface IProps {
  classes: any;
}
class Editorial extends React.Component<IProps, {}> {
  state = {
    gotData: false,
    list: [],
    loaded:false,
  };
  componentDidMount() {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geteditorial`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.token}`,
        },body: JSON.stringify({
          contest_id: localStorage.code,
          q_id: getParameterByName("id"),
        })
      }
    )
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({ list: res, loaded: true });
        console.log(res);
        
      })
      .catch((error) => {        console.log(error);
      });
  }
    render() {
      return (
        <Layout>
           {this.state.loaded ? 
      <>
          {this.state.list? (
                  <>
            <div style={{margin:"50px auto",width:"90%", maxWidth:"1000px", textAlign:"left", padding:"30px", borderRadius:"20px", border:"2px solid #104E8B", borderTop:"10px solid #104E8B", borderBottom:"10px solid #104E8B", color:"#104E8B"}}>
                <h3>Contest Name - {localStorage.code}</h3>
                <hr></hr>
                <br/>
                <h4>{this.state.list['ques_name']}</h4>
                <p>{this.state.list['question']}</p>
                <hr></hr>
                <br/>
                <h4>Solution</h4>
                <p>{this.state.list['solution']}</p>
                <hr></hr>
                <br/>
                <h4>code</h4>
                
                  <Viewer value={this.state.list['code']} lang="c++" />
            </div>
            
            </>
            )
            : null}
            <div className="Footer">
              &copy; Created and maintained by GNU/Linux Users' group, Nit
              Durgapur
            </div>
            </>
        : <Loader />}
        </Layout>
          
        
      );
    }
    
  }

  function getParameterByName(name, url = window.location.href) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  
  export default Editorial;