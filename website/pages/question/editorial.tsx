import React, {useState} from "react";
import Layout from "../../components/layout";
import Loader from "../../components/loading";
import Viewer from "components/codeViewer";
import {useEffect} from 'react';

//Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getEditorial } from "store/actions/editorialAction";

function Editorial(){
  const dispatch = useDispatch()
    const {editorial} = useSelector(state=>state.editorialReducer);
    const {loaded} = useSelector(state=>state.editorialReducer);
    useEffect(() => {
        dispatch(getEditorial());
    },[])

    console.log(editorial);
    const [loadedState, setLoaded] = useState(false);
    const [Editorial, setEditorial] = useState([]);
    
    if (editorial.length !== Editorial.length || loadedState!=loaded ) {
      setLoaded(false);
      setEditorial(editorial);
      setLoaded(loaded);
    } else if (
      editorial.length === 0 &&
      loaded === true &&
      loadedState === false
    ) {
      setEditorial(editorial);
      setLoaded(loaded);
    }
      return (
        <Layout>
           {loadedState? 
      <>
          {Editorial? (
                  <>
            <div style={{margin:"50px auto",width:"90%", maxWidth:"1000px", textAlign:"left", padding:"30px", borderRadius:"20px", border:"2px solid #104E8B", borderTop:"10px solid #104E8B", borderBottom:"10px solid #104E8B", color:"#104E8B"}}>
                <h3>Contest Name - {localStorage.code}</h3>
                <hr></hr>
                <br/>
                <h4>{Editorial['ques_name']}</h4>
                <p>{Editorial['ques_text']}</p>
                <hr></hr>
                <br/>
                <h4>Solution</h4>
                <p>{Editorial['solution']}</p>
                <hr></hr>
                <br/>
                <h4>code</h4>
                <Viewer value={Editorial['code']} lang="c++" />
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
  export default Editorial;