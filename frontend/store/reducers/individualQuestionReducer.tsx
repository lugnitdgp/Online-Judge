import {
    INDI_QUES_REQUEST_PENDING,
    INDI_QUES_DATA_SUCCESS,
    INDI_QUES_DATA_FAILURE,
} from "../actionTypes/contestActionType";

const initialState = {
    qdata: [],
    loaded: false,
    message: "",
    error: "",
  };

  function individualQuestionReducer(state = initialState, action) {
    switch (action.type) {
        case INDI_QUES_REQUEST_PENDING:
            {
                return Object.assign({}, state, {
                    loaded: false,
                    error: "",
                    message: "",
                });
            }

        case INDI_QUES_DATA_SUCCESS:
            {   
                return Object.assign({}, state, {
                    qdata: action.payload,
                    loaded: true,
                })
            }

        case INDI_QUES_DATA_FAILURE:
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

export default individualQuestionReducer;