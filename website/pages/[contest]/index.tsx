import React, { useEffect, useState } from "react";
import Layout from "components/layout";
import { TableContainer, TableHead, TableCell, Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Timer from "../../components/Timer";
import Grid from "@material-ui/core/Grid";
import SecondaryNav from "../../components/secondaryNav";
import { useRouter } from 'next/router'
import Loader from "../../components/loading";
import Link from 'next/link'
import {contestService} from '../../services/contestService'

//Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getQuestionsData } from "../../store/actions/questionsAction";


export default function questionlist() {
  ////
  const router = useRouter()
  const { contest } = router.query
  const dispatch = useDispatch();

  const { questions } = useSelector((state) => state.questionsReducer);

  const { timestamp } = useSelector((state) => state.questionsReducer);

  const { message } = useSelector((state) => state.questionsReducer);

  const { ended } = useSelector((state) => state.questionsReducer);

  const { loaded } = useSelector((state) => state.questionsReducer);




  useEffect(() => {
    if (!localStorage.token) window.location.href = "/";
    else if (!localStorage.code) {
      localStorage.setItem("code", contest.toString());
       var temp = contestService.getIndiContest()
      console.log(temp)
    }
    if (!localStorage.source) {
      var contestdeet = [
        {
          name: localStorage.code,
        },
      ];
      var arr = contestdeet;
      console.log(arr);

      localStorage.setItem("source", JSON.stringify(arr));
    } else {
      console.log(JSON.parse(localStorage.source));
      var source = JSON.parse(localStorage.source);
      var flag = false;
      source.map((el) => {
        console.log(el);
        if (el.name === localStorage.code) flag = true;
      });
      if (flag === false) {
        var newdeet = {
          name: localStorage.code,
        };
        source.push(newdeet);
        localStorage.setItem("source", JSON.stringify(source));
      }
    }

  });



  useEffect(() => {
    dispatch(getQuestionsData());
  }, []);

  const [loadedState, setLoaded] = useState(false);
  const [list, setList] = useState([]);
  const [time, setTime] = useState("");
  const [msg, setMsg] = useState("");
  const [endedBool, setEnded] = useState(false);
  ////

  if (JSON.stringify(list) !== JSON.stringify(questions) || loadedState != loaded || endedBool !== ended) {
    setList(questions)
    setTime(timestamp)
    setMsg(message)
    setLoaded(loaded)
    setEnded(ended)
  }

  return (
    <Layout>

      {loadedState ?
        <>
          <SecondaryNav />
          <div style={{ maxWidth: "1000px", margin: "10px auto" }}>
            <Grid container spacing={0}>
              <Grid item xs={12} md={6}>
                <p
                  className="Qcontestname"
                >
                  Contest Name
              </p>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Timer time={time} message={msg} />
              </Grid>
            </Grid>
          </div>
          <TableContainer
            component={Paper}
            style={{
              maxWidth: "1000px",
              margin: "20px auto",
              marginBottom: "100px",
            }}
          >
            <Table
              //className={classes.table}
              size="small"
              aria-label="simple table"
              style={{
                maxWidth: "1000px",
                margin: "0px auto",
                border: "2px solid #104e8b",
                borderRadius: "10px",
              }}
            >
              <TableHead style={{ paddingBottom: "20px" }}>
                <TableRow
                  style={{
                    backgroundColor: "#104e8b",
                    color: "#fff",
                    paddingBottom: "20px",
                  }}
                >
                  <TableCell style={{ color: "#fff", padding: "20px" }}>
                    Question Code
                </TableCell>
                  <TableCell
                    align="left"
                    style={{ color: "#fff", marginBottom: "20px" }}
                  >
                    Question
                </TableCell>
                  <TableCell
                    align="left"
                    style={{ color: "#fff", marginBottom: "20px" }}
                  >
                    Status
                </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#fff", marginBottom: "20px" }}
                  >
                    Score
                </TableCell>
                  {endedBool == false ? (null) : (
                    <TableCell
                      align="right"
                      style={{ color: "#fff", marginBottom: "20px" }}
                    >
                      Editorial
                    </TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {list.length > 0
                  ? list.map((item, i) => (
                    <>
                      <TableRow
                        key={i}
                        style={{
                          borderTop: "2px solid #104e8b",
                          borderBottom: "2px solid #104e8b",
                          borderRadius: "10px",
                          width: "100%",
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            textDecoration: "None",
                            color: "#104e8b",
                            padding: "20px",
                            margin: "10px",
                          }}
                        >
                          <Link href="/[contest]/[question]" as={`/${contest}/${item.question_code}`}>
                            <a

                              style={{ textDecoration: "None", color: "#104e8b" }}
                            >
                              {item.question_code}
                            </a></Link>
                        </TableCell>

                        <TableCell
                          align="left"
                          style={{
                            textDecoration: "None",
                            borderRadius: "10px",
                          }}
                        >
                          <Link href="/[contest]/[question]" as={`/${contest}/${item.question_code}`}>
                            <a style={{ textDecoration: "None", color: "#104e8b" }}
                            >{item.question_name}</a>
                          </Link>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ textDecoration: "None", color: "#104e8b" }}
                        >
                          {item.icon}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ textDecoration: "None", color: "#104e8b" }}
                        >
                          {item.question_score}
                        </TableCell>
                        {endedBool == false ? (null) : (
                          <TableCell
                            align="right"
                            style={{
                              textDecoration: "None",
                              borderRadius: "10px",
                            }}
                          >
                            <Link href="/[contest]/[question]/editorial" as={`/${contest}/${item.question_code}/editorial`}></Link>
                            <a
                              style={{ textDecoration: "None", color: "#104e8b" }}
                            >
                              View Editorial
                          </a>
                          </TableCell>)}
                      </TableRow>
                    </>
                  ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="FooterFixed">
            &copy; Created and maintained by GNU/Linux Users' group, Nit Durgapur
        </div>
        </>
        : <Loader />}

    </Layout>
  );

}