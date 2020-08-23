import {
    CONTEST_REQUEST_PENDING,
    CONTEST_DATA_SUCCESS,
    CONTEST_DATA_FAILURE,
} from "../actionTypes/contestActionType";

const initialState = {
    contests: [],
    loaded: false,
    message: "",
    error: "",
};

function contestReducer(state = initialState, action) {
    switch (action.type) {
        case CONTEST_REQUEST_PENDING:
            {
                return Object.assign({}, state, {
                    loaded: false,
                    error: "",
                    message: "",
                });
            }

        case CONTEST_DATA_SUCCESS:
            {
                var ongoing = [];
                var upcoming = []
                var ended = [];
                var contestTotal = [];

                action.payload.map((contest) => {
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

                return Object.assign({}, state, {
                    contests: contestTotal,
                    loaded: true,
                })
            }

        case CONTEST_DATA_FAILURE:
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

export default contestReducer;