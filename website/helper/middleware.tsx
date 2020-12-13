import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import CloseTwoToneIcon from "@material-ui/icons/CloseTwoTone";
const processContests = (payload) =>{
    var ongoing = [];
    var upcoming = []
    var ended = [];
    var contestTotal = [];

    payload.map((contest) => {
        console.log(contest);
        var dateObj = new Date(contest["start_time"] * 1000);
        contest["start"] = dateObj.toString();
        contest["start"] =
            contest["start"].substring(0, 10) +
            contest["start"].substring(15, 24);
        var today = Date.now();
        var dateo = new Date(today);
        console.log(dateObj.toString(), "   ", dateo.toString(), "  ");
        dateObj = new Date(contest["end_time"] * 1000);
        contest["end"] = dateObj.toString();
        contest["end"] =
            contest["end"].substring(0, 10) + contest["end"].substring(15, 24);
        console.log(contest["end"]);
        if (
            contest["start_time"] * 1000 < today &&
            contest["end_time"] * 1000 > today
        ) {
            contest["timestamp"] = contest["end_time"] * 1000;
            ongoing.push(contest);
        } else if (contest["start_time"] * 1000 > today) {
            contest["upcoming"] = true;
            contest["timestamp"] = contest["start_time"] * 1000;
            upcoming.push(contest);
        } else {
            contest["ended"] = true;
            ended.push(contest);
        }
    })

    contestTotal.push(ongoing, upcoming, ended);

    return contestTotal;
}


const processLeaderboard = (payload)=>{
    var columns = [
        {
          name: "rank",
          label: "RANK",
          options: {
            filter: false,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                textAlign: "center",
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
            setCellProps: () => ({
              style: { fontWeight: "900", textAlign: "center" },
            }),
          },
        },
        {
          name: "image",
          label: " ",
          options: {
            filter: false,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
          },
        },
        {
          name: "name",
          label: "NAME",
          options: {
            filter: true,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                textAlign: "center",
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
            setCellProps: () => ({
              style: { fontWeight: "900", textAlign: "center" },
            }),
          },
        },
        {
          name: "score",
          label: "SCORE",
          options: {
            filter: true,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                textAlign: "center",
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
            setCellProps: () => ({
              style: { fontWeight: "900", textAlign: "center" },
            }),
          },
        },
      ];

      payload.map((ques) => {
        var newCol = {
          name: `${ques.question_name}`,
          label: `${ques.question_name}`,
          options: {
            filter: false,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                textAlign: "center",
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
            setCellProps: () => ({
              style: { fontWeight: "900", textAlign: "center" },
            }),
          },
        };

        columns.push(newCol);
      });
    return columns;
}

const processPS = (payload)=> {
    var arr = [];
                payload.map((r) => {
                    var stat = "";
                    var time = "";
                    var mem = "";
                    const cases = JSON.parse(r.status);
                    cases.map((testcase) => {
                      if (testcase.code == 1) {
                        stat = "Compilation Error";
                        time = "NA";
                        mem = "NA";
                      } else {
                        if (testcase.status.run_status == "AC") {
                          if (stat == "") {
                            stat = "AC";
                            time = testcase.status.cpu_time + " sec";
                            mem = testcase.status.memory_taken + " kb ";
                          }
                        } else {
                          stat = testcase.status.run_status;
                          time = testcase.status.cpu_time + " sec";
                          mem = testcase.status.memory_taken + " kb";
                        }
                      }
                    });
          
                    var runtimestats = {
                      source: r.code,
                      testcases: cases,
                      lang: r.lang,
                    };
          
                    var payload = {
                      user: r.name,
                      problem: r.question_name,
                      status: stat,
                      time: time,
                      memory: mem,
                      code: runtimestats,
                    };
          
                    arr.push(payload);
                  });

                  return arr
}

const processQuestions =(payload, state)=>{
    var qstatus= payload[1]
                var questionsvar = payload[0]
                questionsvar.map((question) => {
                    question.icon = <div></div>;
                        qstatus.map((ques) => {
                      if (ques.ques_name === question.question_name) {
                        if (ques.correct >= 1) question.icon = <CheckTwoToneIcon />;
                        else question.icon = <CloseTwoToneIcon />;
                      }
                    });
                  });
                  var today = Date.now();
                  var start = localStorage.start * 1000;
                  var end = localStorage.end * 1000;
                  console.log(start + "   " + today + "  " + end);
                  if (start <= today && end > today) {

                    return Object.assign({}, state, {
                        loaded: true,
                        timestamp: end,
                        message: "The Contest ends in",
                        questions: questionsvar,
                        ended:false
                    });
                    
                  } else if (start <= today && end <= today) {
                    return Object.assign({}, state, {
                        loaded: true,
                        timestamp: 0,ended:true,
                        message: "The Contest has ended",
                        questions: questionsvar
                    });
                  } else if (start > today) {
                    return Object.assign({}, state, {
                        loaded: true,
                        ended:false,
                        timestamp: start,
                        message: "TThe Contest begins in",
                        questions: questionsvar
                    });
                }

                return null;
}


const processAllSubmissions = (payload)=>{
    var arr = [];
                payload.map((r) => {
                  var stat = "";
                  var time = "";
                  var mem = "";
                  var isFail = false;
                  var sign;
                  const cases = JSON.parse(r.status);
                  cases.map((testcase) => {
                    if (testcase.code == 1) {
                      stat = "Compilation Error";
                      isFail = true;
                      time = "NA";
                      mem = "NA";
                    } else {
                      if (testcase.status.run_status == "AC") {
                        if (stat == "") {
                          stat = "AC";
                          isFail = false;
                          time = testcase.status.cpu_time + " sec";
                          mem = testcase.status.memory_taken;
                        }
                      } else {
                        stat = testcase.status.run_status;
                        isFail = true;
                        time = testcase.status.cpu_time + " sec";
                        mem = testcase.status.memory_taken;
                      }
                    }
                    if (isFail == true) sign = <CloseTwoToneIcon />;
                    else sign = <CheckTwoToneIcon />;
                  });
        
                  var payload = {
                    user: r["name"],
                    problem: r.question,
                    status: stat,
                    time: time,
                    memory: mem,
                    isFail: sign,
                  };
        
                  arr.push(payload);
                });

                return arr;

}

export const middleware = {processContests, processAllSubmissions, processQuestions,processLeaderboard, processPS}
