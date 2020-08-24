import {
    PERSONAL_SUBMISSIONS_REQUEST_PENDING,
    PERSONAL_SUBMISSIONS_DATA_SUCCESS,
    PERSONAL_SUBMISSIONS_DATA_FAILURE,
} from "../actionTypes/contestActionType";

const initialState = {
    personal_submissions: [],
    loaded: false,
    message: "",
    error: "",
  };

  function personalSubmissionsReducer(state = initialState, action) {
    switch (action.type) {
        case PERSONAL_SUBMISSIONS_REQUEST_PENDING:
            {
                return Object.assign({}, state, {
                    loaded: false,
                    error: "",
                    message: "",
                });
            }

        case PERSONAL_SUBMISSIONS_DATA_SUCCESS:
            {
                var arr = [];
                action.payload.map((r) => {
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

                  console.log(arr);
                return Object.assign({}, state, {
                    personal_submissions: arr,
                    loaded: true,
                })
            }

        case PERSONAL_SUBMISSIONS_DATA_FAILURE:
            {
                return Object.assign({}, state, {
                    error: action.payload.detail,
                    loaded: true,
                })
            }

        default:
            return state
    }
}

export default personalSubmissionsReducer;