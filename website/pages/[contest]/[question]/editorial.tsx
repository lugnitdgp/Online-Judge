import React, {useState} from "react";
import Layout from "../../../components/layout";
import Loader from "../../../components/loading";
import Viewer from "components/codeViewer";
import {useEffect} from 'react';
import { useRouter } from 'next/router'


//Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getEditorial } from "store/actions/editorialAction";

function Editorial(){
  const router = useRouter()
  const { contest, question } = router.query
  const dispatch = useDispatch()
    const {editorial} = useSelector(state=>state.editorialReducer);
    const {loaded} = useSelector(state=>state.editorialReducer);
    useEffect(() => {
      if (!localStorage.token) window.location.href = "/";
      else if (!localStorage.code || !localStorage.question) {
        localStorage.setItem("code", contest.toString())
        localStorage.setItem("question", question.toString())
      }
    })
    useEffect(() => {
        dispatch(getEditorial());
    },[])

    console.log(editorial);
    const [loadedState, setLoaded] = useState(false);
    const [Editorial, setEditorial] = useState([]);
    
    if (JSON.stringify(editorial) !== JSON.stringify(Editorial) || loadedState!=loaded ) {
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
            <div className="editorialBody">
                <h3>Contest Name - {localStorage.code}</h3>
                <hr></hr>
                <br/>
                <h4>{Editorial['ques_name']}</h4>
                <div dangerouslySetInnerHTML={{ __html : Editorial['ques_text']}} />
                <hr></hr>
                <br/>
                <h4>Solution</h4>
                <p>{Editorial['solution']}</p>
                <hr></hr>
                <br/>
                <h4>code</h4>
                <Viewer value={decodeURIComponent((Editorial['code']))} lang="c++" />
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