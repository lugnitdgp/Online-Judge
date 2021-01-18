import {
    LEADERBOARD_REQUEST_PENDING,
    LEADERBOARD_DATA_SUCCESS,
    LEADERBOARD_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import { contestService } from "../../services/contestService"

export function getLearderboardDataQues() {
    return function(dispatch) {
        dispatch({ type: LEADERBOARD_REQUEST_PENDING });
        return contestService.getLeaderboardDataQues()
            .then((result) => {
                return contestService.getLeaderboardData().then((result2) => {
                    var arr=[]
                    arr.push(result2.data,result);
                    dispatch({ type: LEADERBOARD_DATA_SUCCESS, payload: arr })
            }).catch(() => {
                dispatch({
                    type: LEADERBOARD_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching leaderboard data" },
                });
            });
             // dispatch({ type: LEADERBOARD_QUES_DATA_SUCCESS, payload: result })
            })
            .catch(() => {
                dispatch({
                    type: LEADERBOARD_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching question data for leaderboard" },
                });
            });
    };
}