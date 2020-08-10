import React from "react";
import Layout from "../components/Layout";
import Loader from "../components/loading";

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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geteditorial?contest_id=JCC`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.token}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({ list: res, loaded: true });
        console.log(res);
        
      })
      .catch((error) => {
        console.log(error);
      });
  }
    render() {
      return (
        <Layout>
           {this.state.loaded ? 
      <>
          {this.state.list.length > 0
                ? this.state.list.map((item, i) => (
                  <>
            <div key={i} style={{margin:"50px auto",width:"90%", maxWidth:"1000px", textAlign:"left", padding:"30px", borderRadius:"20px", border:"2px solid #104E8B", borderTop:"10px solid #104E8B", borderBottom:"10px solid #104E8B", color:"#104E8B"}}>
                <h3>Contest Name(JCC)</h3>
                <hr></hr>
                <br/>
                <h4>{item.ques_name}</h4>
                <p>{item.question}</p>
                <hr></hr>
                <br/>
                <h4>Solution</h4>
                <p>{item.solution}</p>
                <hr></hr>
                <br/>
                <h4>code</h4>
                <div
                className="code"
                style={{ fontSize: 15, color:"#000", backgroundColor:"#eee", padding:"10px", margin:"0px" }}
                dangerouslySetInnerHTML={{
                  __html: item.code,
                }}
                />
            </div>
            
            </>
            ))
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
  
  export default Editorial;