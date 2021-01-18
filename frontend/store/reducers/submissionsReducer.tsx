import {
    SUBMISSIONS_REQUEST_PENDING,
    SUBMISSIONS_DATA_SUCCESS,
    SUBMISSIONS_DATA_FAILURE,
} from "../actionTypes/contestActionType";
import {middleware} from "../../helper/middleware";
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
                
                return Object.assign({}, state, {
                    submissions: middleware.processAllSubmissions(action.payload),
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