import {
    PERSONAL_SUBMISSIONS_REQUEST_PENDING,
    PERSONAL_SUBMISSIONS_DATA_SUCCESS,
    PERSONAL_SUBMISSIONS_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import {middleware} from "../../helper/middleware";

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
                
                return Object.assign({}, state, {
                    personal_submissions: middleware.processPS(action.payload),
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