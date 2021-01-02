import {
  LEADERBOARD_REQUEST_PENDING,
  LEADERBOARD_DATA_SUCCESS,
  LEADERBOARD_DATA_FAILURE,
} from "../actionTypes/contestActionType";


import {middleware} from "../../helper/middleware";
const initialState = {
  leaderboard: [],
  data: [],
  loaded: false,
  message: "",
  error: "",
};

function leaderboardReducer(state = initialState, action) {
  switch (action.type) {
    case LEADERBOARD_REQUEST_PENDING: {
      return Object.assign({}, state, {
        loaded: false,
        error: "",
        message: "",
      });
    }
    case LEADERBOARD_DATA_SUCCESS: {
      // console.log(action.payload)
      console.log("ffs i hate this bitch")
      console.log(action.payload)
      return Object.assign({}, state, {
        leaderboard: middleware.processLeaderboard(action.payload[1]),
        data:action.payload[0],
        loaded: true,
      });
    }

    case LEADERBOARD_DATA_FAILURE: {
      return Object.assign({}, state, {
        error: action.payload.detail,
        loaded: true,
      });
    }
    default:
      return state;
  }
}

export default leaderboardReducer;
