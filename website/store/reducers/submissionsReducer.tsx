import {
    SUBMISSIONS_REQUEST_PENDING,
    SUBMISSIONS_DATA_SUCCESS,
    SUBMISSIONS_DATA_FAILURE,
} from "../actionTypes/contestActionType";
import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import CloseTwoToneIcon from "@material-ui/icons/CloseTwoTone";
const initialState = {
    submissions: [],
    loaded: false,
    message: "",
    error: "",
  };

  function submissionsReducer(state = initialState, action) {
    switch (action.type) {
        case SUBMISSIONS_REQUEST_PENDING:
            {
                return Object.assign({}, state, {
                    loaded: false,
                    error: "",
                    message: "",
                });
            }

        case SUBMISSIONS_DATA_SUCCESS:
            {
                var arr = [];
                action.payload.map((r) => {
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

                return Object.assign({}, state, {
                    submissions: arr,
                    loaded: true,
                })
            }

        case SUBMISSIONS_DATA_FAILURE:
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

export default submissionsReducer;