import {
    CONTEST_REQUEST_PENDING,
    CONTEST_DATA_SUCCESS,
    CONTEST_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import {middleware} from "../../helper/middleware"

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
                return Object.assign({}, state, {
                    contests: middleware.processContests(action.payload),
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