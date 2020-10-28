import {
    QUESTIONS_REQUEST_PENDING,
    QUESTIONS_DATA_SUCCESS,
    QUESTIONS_DATA_FAILURE,
} from "../actionTypes/contestActionType";
import {middleware} from "../../helper/middleware";
const initialState = {
    questions: [],
    loaded: false,
    ended: false,
    timestamp: 0,
    message: "",
    error: "",
  };

  function questionsReducer(state = initialState, action) {
    switch (action.type) {
        case QUESTIONS_REQUEST_PENDING:
            {
                return Object.assign({}, state, {
                    loaded: false,
                    error: "",
                    message: "",
                });
            }

        case QUESTIONS_DATA_SUCCESS:
            {   
                return middleware.processQuestions(action.payload, state);
            }

        case QUESTIONS_DATA_FAILURE:
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

export default questionsReducer;