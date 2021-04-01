import React, { useState } from "react";
import Layout from "../../../components/layout";
import Loader from "../../../components/loading";
// import Viewer from "components/codeViewer";
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import dynamic from "next/dynamic";

//Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getEditorial } from "store/actions/editorialAction";
import { Paper } from "@material-ui/core";
import Disqus from "disqus-react";
import { connected } from "process";

const Viewer = dynamic(import("components/codeViewer"), { ssr: false });

function Editorial() {
  const router = useRouter()
  const { contest, question } = router.query
  const dispatch = useDispatch()
  const { editorial } = useSelector(state => state.editorialReducer);
  const { loaded } = useSelector(state => state.editorialReducer);
  useEffect(() => {
    if (!localStorage.token) window.location.href = "/";
    localStorage.setItem("code", contest.toString())
    localStorage.setItem("question", question.toString())
  })
  useEffect(() => {
    dispatch(getEditorial());
  }, [])

  const disqusShortname = "onlinejudge2";
  const disqusConfig = {
    url: 'http://localhost:3000'+'/#!'+window.location.href,
    identifier: window.location.href,
    title: "Title of Your Article",
  };

  const [loadedState, setLoaded] = useState(false);
  const [Editorial, setEditorial] = useState({
    code: ""
  });

  if (JSON.stringify(editorial) !== JSON.stringify(Editorial) || loadedState != loaded) {
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
      {loadedState ?
        <>
          {Editorial ? (
            <>
              <div className="editorialBody">
                <h3>Contest Name - {localStorage.code}</h3>
                <hr></hr>
                <br />
                <h4>{Editorial['ques_name']}</h4>
                <div dangerouslySetInnerHTML={{ __html: Editorial['ques_text'] }} />
                <hr></hr>
                <br />
                <h4>Solution</h4>
                <p>{Editorial['solution']}</p>
                <hr></hr>
                <br />
                <h4>code</h4>
                <Viewer value={encodeURI(Editorial['code'])} lang="c++" />
              </div>

            </>
          )
            : null}
          <Paper elevation={0} className="descriptionPaper2">
            <div style={{ margin: "20px", textAlign: "center" }}>
              <Disqus.DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
              />
            </div>
          </Paper>
          <div className="Footer">
          Sponsored by : &nbsp;&nbsp;
            <img alt="." src="/codingblocks.png" className="FooterImg" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <img alt="." src="/IOCL.png" className="FooterImg" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <img alt="." src="/techbairn.png" className="FooterImg" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <img alt="." src="/wt.png" className="FooterImg" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <img alt="." src="/pb.png" className="FooterImg" />
            <br/>
            <br/>
            &copy; Created and maintained by GNU/Linux Users' group, Nit
            Durgapur
            </div>
        </>
        : <Loader />}
    </Layout>
  );
}
export default Editorial;