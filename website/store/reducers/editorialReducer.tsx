import {
    EDITORIAL_REQUEST_PENDING,
    EDITORIAL_DATA_SUCCESS,
    EDITORIAL_DATA_FAILURE,
} from "../actionTypes/contestActionType";

const initialState = {
    editorial: [],
    loaded: false,
    message: "",
    error: "",
  };

  function editorialReducer(state = initialState, action) {
    switch (action.type) {
        case EDITORIAL_REQUEST_PENDING:
            {
                return Object.assign({}, state, {
                    loaded: false,
                    error: "",
                    message: "",
                });
            }

        case EDITORIAL_DATA_SUCCESS:
            {
                
                
                return Object.assign({}, state, {
                    editorial: action.payload,
                    loaded: true,
                })
            }

        case EDITORIAL_DATA_FAILURE:
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

export default editorialReducer;