import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
// import Editor from "components/editor";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Layout from "components/layout";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckCircleOutline, Error } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FileCopySharpIcon from "@material-ui/icons/FileCopySharp";
import Timer from "../../../components/Timer";
import SecondaryNav from "../../../components/secondaryNav";
import Loader from "../../../components/loading";
import Disqus from "disqus-react"
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { getIndividualQuestionData } from "../../../store/actions/individualQuestionAction"
import dynamic from "next/dynamic";

const Editor = dynamic(import("components/editor"), { ssr: false });

export default function QuesDetail() {

  const router = useRouter()
  const { contest, question } = router.query

  var interval;

  function changeCopyState() {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500);
    return null;
  }

  function submitcode(code: any, lang: any) {
    setLoading(true);
    setRes([])
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.token}`,
      },
      body: JSON.stringify({
        code: encodeURI(code),
        lang: lang,
        q_id: data[`question_code`],
        contest_id: localStorage.code,
      }),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((res) => {
        console.log(res);
        if (res.status === 302) {
          // alert(res.message);
          setLoading(false)
        } else {
          localStorage.taskid = res["task_id"];
          interval = setInterval(() => statuscode(), 5000);
        }
      })
      .catch((error) => console.log(error));
    return null;
  };


  async function autosavecode(code: any, lang: any) {
    var source2 = [];
    //setValues(code)
    source.map((contest) => {
      if (contest.name === localStorage.code) {
        var sourcecode = {
          lang: lang,
          code: encodeURI(code),
          qid: question,
        };
        if (!contest.questions) {
          contest.questions = [sourcecode];
        } else {
          var flag = false;
          contest.questions.map((ques) => {
            if (ques.qid == sourcecode.qid) {
              ques.langcode = {}
              Object.assign(ques.langcode, {
                [sourcecode.lang]: sourcecode.code
              })
              flag = true;
            }
          });
          if (flag === false) {
            contest.questions.push(sourcecode);
          }
        }
      }
      source2.push(contest);
    });
    //setValues(code);
    setSource(source2);
    localStorage.setItem("source", JSON.stringify(source2));
    return null;
  };

  function statuscode() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.token}`,
      },
      body: JSON.stringify({
        q_id: data[`question_code`],
        task_id: localStorage.taskid,
        contest_id: localStorage.code,
      }),
    }).then((resp) => resp.json())
      .then((response) => {
        console.log(response);
        if (response.status === 302) {
          // alert(response.message)
        }
        else {
          console.log(response)
          setRes(response)
          setLoading(false)
          clearInterval(interval)
        }
      })
      .then(() => console.log(res))
      .catch((err) => console.log(err))
    return null;
  };


  const disqusShortname = "onlinejudge-1"
  const disqusConfig = {
    url: "http://localhost:3000",
    identifier: "article-id",
    title: "Title of Your Article"
  }

  ///////////////////////

  const [loadedState, setLoaded] = useState(false);
  const [source, setSource] = useState([])
  const [data, setData] = useState([])
  const [timestamp, setTime] = useState(0)
  const [message, setMsg] = useState("")
  const [ended, setEnded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [language, setLang] = useState("c++")
  const [value, setValues] = useState("")
  const [theme, setTheme] = useState("theme-tomorrow")
  const [isLoading, setLoading] = useState(false)
  const [res, setRes] = useState([])
  const [num, setNum] = useState(0)

  const dispatch = useDispatch()
  const { qdata } = useSelector(state => state.individualQuestionReducer);
  const { loaded } = useSelector(state => state.individualQuestionReducer);

  useEffect(() => {
    if (!localStorage.token) window.location.href = "/";
    localStorage.setItem("code", contest.toString())
    localStorage.setItem("question", question.toString())

    if (!localStorage.source) window.location.href = `/${localStorage.code}`;
  })

  useEffect(() => {
    dispatch(getIndividualQuestionData());

    

    var today = Date.now();
    var start = localStorage.start * 1000;
    var end = localStorage.end * 1000;

    if (start < today && end > today) {
      setTime(end)
      setMsg("The Contest ends in")
    } else if (start < today && end < today) {
      setMsg("The Contest has ended")
      setEnded(true)
    } else if (start > today) {
      setTime(start)
      setMsg("The Contest begins in")
    }
  }, [])

  if (JSON.stringify(qdata) !== JSON.stringify(data) || loadedState != loaded) {
    console.log(qdata)
    setData(qdata)
    setLoaded(loaded)
  }

  function setCodeFromAutoSave(source2: any) {
    console.log("this is source2", source2);
    let flag = false;
    if (JSON.stringify(source) != JSON.stringify(source2))
      setSource(source2);

    source2.map((contest) => {
      console.log(contest)
      if (contest.name === localStorage.code) {
        if (contest.questions)
          contest.questions.map((ques) => {
            if (ques.qid === question.toString()) {
              if(!ques.langcode) return;
              if (!ques.langcode[language] && ques.langcode[language] != "") {
                setValues(decodeURI(ques.code))
                if (decodeURI(ques.code).trim().length > 0) {
                  flag = true
                }
              }
            }

            // setLang(ques.lang)
          });
      }
    })

    if (!flag) setValues(decodeURIComponent(localStorage.getItem(`${localStorage.code}:template:${language}`)))

    return null;
  }

  useEffect(() => {
    var source2 = JSON.parse(localStorage.source);
    setCodeFromAutoSave(source2)
    // if (language != "")
    // setValues(decodeURIComponent(localStorage.getItem(`${localStorage.code}:template:${language}`)))
  }, [language])


  useEffect(() => {
    if (num == 1)
      autosavecode(value, language);
    else if (num == 0)
      setNum(1)
  }, [value]);

  return (
    <div>
      <Layout>
        {loadedState ?
          <>
            <SecondaryNav />
            <div style={{ maxWidth: "1000px", margin: "0px auto", padding: "0" }}>
              <Timer
                time={timestamp}
                message={message}
                style={{ fontSize: "12px" }}
              />
            </div>
            <div style={{ margin: "20px" }}>
              <Paper
                elevation={0}
                className="descriptionPaper"
                style={{ margin: "20px auto" }}
              >
                <div className="descriptionDetails">
                  <Typography
                    style={{
                      color: "#104e8b",
                      fontSize: "18px",
                      textTransform: "capitalize",
                    }}
                    gutterBottom
                  >
                    {data[`question_code`]}&nbsp;|&nbsp;
                {data[`question_name`]}
                  </Typography>

                  <div
                    style={{ fontSize: 15 }}
                    dangerouslySetInnerHTML={{
                      __html: data[`question_text`],
                    }}
                  />
                  <hr></hr>
                  <CopyToClipboard
                    text={data[`input_example`]}
                    onCopy={changeCopyState}
                  >
                    <Typography
                      style={{ fontSize: "18px", color: "#104e8b" }}
                      gutterBottom
                    >
                      <div>
                        <div className="row">
                          <div
                            className="column"
                            style={{ marginLeft: 15, verticalAlign: "middle" }}
                          >
                            INPUT EXAMPLE
                      </div>
                          <div className="column">
                            <Tooltip
                              title={
                                copied ? "COPIED !" : "COPY TO CLIPBOARD"
                              }
                            >
                              <IconButton aria-label="upload picture">
                                <FileCopySharpIcon
                                  style={{
                                    width: 20,
                                    height: 20,
                                    bottom: 10,
                                    position: "relative",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                        <Typography variant="subtitle1" gutterBottom>
                          <div
                            style={{ whiteSpace: "pre-wrap" }}
                            dangerouslySetInnerHTML={{
                              __html: data[`input_example`],
                            }}
                          />
                        </Typography>
                      </div>
                    </Typography>
                  </CopyToClipboard>
                  <hr></hr>
                  <CopyToClipboard
                    text={data[`output_example`]}
                    onCopy={changeCopyState}
                  >
                    <Typography
                      style={{ fontSize: "18px", color: "#104e8b" }}
                      gutterBottom
                    >
                      <div>
                        <div className="row">
                          <div
                            className="column"
                            style={{ marginLeft: 15, verticalAlign: "middle" }}
                          >
                            OUTPUT EXAMPLE
                      </div>
                          <div className="column">
                            <Tooltip
                              title={
                                copied ? "COPIED !" : "COPY TO CLIPBOARD"
                              }
                            >
                              <IconButton aria-label="upload picture">
                                <FileCopySharpIcon
                                  style={{
                                    width: 20,
                                    height: 20,
                                    bottom: 10,
                                    position: "relative",
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                        <Typography variant="subtitle1" gutterBottom>
                          <div
                            style={{ whiteSpace: "pre-wrap" }}
                            dangerouslySetInnerHTML={{
                              __html: data[`output_example`]
                            }}
                          />
                        </Typography>
                      </div>
                    </Typography>
                  </CopyToClipboard>
                </div>
              </Paper>

              <Paper elevation={0} className="descriptionPaper2">
                <div style={{ margin: "0 auto", textAlign: "center" }}>
                  <FormControl className="formControl">
                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      value={language}
                      onChange={(e) =>
                        setLang(e.target.value as string)
                      }
                    >
                      {data["languages"]?.map((val) => (

                        <MenuItem value={val}>{val}</MenuItem>
                      ))}

                    </Select>
                  </FormControl>

                  <FormControl className="formControl">
                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      value={theme}
                      onChange={(e) =>
                        setTheme(e.target.value as string)
                      }
                    >
                      <MenuItem value="theme-terminal">terminal</MenuItem>
                      <MenuItem value="theme-tomorrow">tomorrow</MenuItem>
                      <MenuItem value="theme-twilight">twilight</MenuItem>
                    </Select>
                  </FormControl>
                  <Editor
                    value={value}
                    lang={language}
                    theme={theme}
                    setValue={(d) => {
                      setValues(d)
                    }}
                  />

                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                      <Button
                        className="descriptionButton"
                        color="primary"
                        variant="outlined"
                        style={{ margin: "20px auto" }}
                        onClick={() =>
                          submitcode(value, language)
                        }
                      >
                        Submit
                      </Button>
                    )}
                </div>

                {res?.length >= 1 ? (
                  <TableContainer component={Paper}>
                    <Table
                      style={{
                        minWidth: 650,
                      }}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>TestCase (Number)</TableCell>
                          <TableCell align="right">Status</TableCell>
                          <TableCell align="right">Run-Time</TableCell>
                          <TableCell align="right">Memory Used</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {res?.map((resa, index) => (

                          (resa.code === 0) ? (
                            <>
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  {index + 1}
                                </TableCell>
                                <TableCell align="right">
                                  <ResultStatus status={resa?.status?.run_status} />
                                </TableCell>
                                <TableCell align="right">
                                  {resa?.status?.cpu_time}
                                </TableCell>
                                <TableCell align="right">
                                  {resa?.status?.memory_taken}
                                </TableCell>
                              </TableRow>
                            </>
                          ) : (
                              (resa.code === 1) ? (
                                <>
                                  <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                      {index + 1}
                                    </TableCell>
                                    <TableCell align="right">
                                      Compilation Error
                              </TableCell>
                                    <TableCell align="right">
                                      N/A
                              </TableCell>
                                    <TableCell align="right">
                                      N/A
                              </TableCell>
                                  </TableRow>
                                </>
                              ) : (
                                  <>
                                    <TableRow key={index}>
                                      <TableCell component="th" scope="row">
                                        {index + 1}
                                      </TableCell>
                                      <TableCell align="right">
                                        <ResultStatus status={resa?.status?.run_status} />
                                      </TableCell>
                                      <TableCell align="right">
                                        {resa?.status?.cpu_time}
                                      </TableCell>
                                      <TableCell align="right">
                                        {resa?.status?.memory_taken}
                                      </TableCell>
                                    </TableRow>
                                  </>
                                )
                            )
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (<> </>
                    // <TableContainer component={Paper}>
                    //   <Table
                    //     style={{
                    //       minWidth: 650,
                    //     }}
                    //     aria-label="simple table"
                    //   >
                    //     <TableHead>
                    //       <TableRow>
                    //         <TableCell>TestCase (Number)</TableCell>
                    //         <TableCell align="right">Status</TableCell>
                    //         <TableCell align="right">Run-Time</TableCell>
                    //         <TableCell align="right">Memory Used</TableCell>
                    //       </TableRow>
                    //     </TableHead>
                    //     <TableBody>
                    //       {res?.map((resa, index) => {
                    //         if(resa.code === 0) {
                    //         (<>
                    //         <TableRow key={index}>
                    //           <TableCell component="th" scope="row">
                    //             {index + 1}
                    //           </TableCell>
                    //           <TableCell align="right">
                    //             <ResultStatus status={resa?.status?.run_status} />
                    //           </TableCell>
                    //           <TableCell align="right">
                    //             {resa?.status?.cpu_time}
                    //           </TableCell>
                    //           <TableCell align="right">
                    //             {resa?.status?.memory_taken}
                    //           </TableCell>
                    //         </TableRow>
                    //         </>)
                    //         }
                    //         else if(resa.code === 1){
                    //           (<TableRow key={index}>
                    //             <TableCell component="th" scope="row">
                    //               {index + 1}
                    //             </TableCell>
                    //             <TableCell align="right">
                    //               Compilation Error
                    //             </TableCell>
                    //             <TableCell align="right">
                    //               N/A
                    //             </TableCell>
                    //             <TableCell align="right">
                    //               N/A
                    //             </TableCell>
                    //           </TableRow>)
                    //         }
                    //         else {
                    //           (<TableRow key={index}>
                    //             <TableCell component="th" scope="row">
                    //               {index + 1}
                    //             </TableCell>
                    //             <TableCell align="right">
                    //               Compilation Error
                    //             </TableCell>
                    //             <TableCell align="right">
                    //               N/A
                    //             </TableCell>
                    //             <TableCell align="right">
                    //               N/A
                    //             </TableCell>
                    //           </TableRow>)
                    //         }
                    //     })}
                    //     </TableBody>
                    //   </Table>
                    // </TableContainer>
                    // <React.Fragment>
                    //   {res?.map((resa, index) => (
                    //     <div>
                    //       {resa.message ? (
                    //         <div key={index}>
                    //           <p>Compilation Error</p>
                    //           <p>{resa?.message?.split(",", 2)[1]}</p>
                    //         </div>
                    //       ) : (
                    //           <TableContainer component={Paper}>
                    //             <Table
                    //               style={{
                    //                 minWidth: 650,
                    //               }}
                    //               aria-label="simple table"
                    //             >
                    //               <TableHead>
                    //                 <TableRow>
                    //                   <TableCell>TestCase (Number)</TableCell>
                    //                   <TableCell align="right">Status</TableCell>
                    //                   <TableCell align="right">Run-Time</TableCell>
                    //                   <TableCell align="right">Memory Used</TableCell>
                    //                 </TableRow>
                    //               </TableHead>
                    //               <TableBody>
                    //                 <TableRow key={index}>
                    //                   <TableCell component="th" scope="row">
                    //                     {index + 1}
                    //                   </TableCell>
                    //                   <TableCell align="right">
                    //                     <ResultStatus status={resa?.status?.run_status} />
                    //                   </TableCell>
                    //                   <TableCell align="right">
                    //                     {resa?.status?.cpu_time}
                    //                   </TableCell>
                    //                   <TableCell align="right">
                    //                     {resa?.status?.memory_taken}
                    //                   </TableCell>
                    //                 </TableRow>
                    //               </TableBody>
                    //             </Table>
                    //           </TableContainer>
                    //         )}
                    //     </div>
                    //   ))}
                    // </React.Fragment>
                  )}
              </Paper>
            </div>

            {ended ?
              null
              : (
                <Paper elevation={0} className="descriptionPaper2">
                  <div style={{ margin: "20px", textAlign: "center" }}>
                    <Disqus.DiscussionEmbed
                      shortname={disqusShortname}
                      config={disqusConfig}
                    />
                  </div>
                </Paper>
              )}

            <div className="Footer">
              &copy; Created and maintained by GNU/Linux Users' group, Nit Durgapur
        </div>
          </>
          : <Loader />}

      </Layout>
    </div>
  );

}

function ResultStatus({ status }) {
  if (status == "AC") {
    return <CheckCircleOutline />;
  } else if (status == "WA") {
    return <Error />;
  } else return status;

}


//////////
