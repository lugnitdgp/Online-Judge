import {
    LEADERBOARD_QUES_REQUEST_PENDING,
    LEADERBOARD_QUES_DATA_SUCCESS,
    LEADERBOARD_QUES_DATA_FAILURE,
    LEADERBOARD_REQUEST_PENDING,
    LEADERBOARD_DATA_SUCCESS,
    LEADERBOARD_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import { contestService } from "../../services/contestService"

export function getLearderboardDataQues() {
    return function(dispatch) {
        dispatch({ type: LEADERBOARD_QUES_REQUEST_PENDING });
        return contestService.getLeaderboardDataQues()
            .then((result) => {
                // if (result.data.detail) {
                //     dispatch({ type: LEADERBOARD_QUES_DATA_FAILURE, payload: result.data });
                // } else {
                    dispatch({ type: LEADERBOARD_QUES_DATA_SUCCESS, payload: result })
                // }
            })
            .catch(() => {
                // console.log(err)
                dispatch({
                    type: LEADERBOARD_QUES_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching question data for leaderboard" },
                });
            });
    };
}

export function getLearderboardData() {
    return function(dispatch) {
        dispatch({ type: LEADERBOARD_REQUEST_PENDING });
        return contestService.getLeaderboardData()
            .then((result) => {
                // if (result.data.detail) {
                //     dispatch({ type: LEADERBOARD_DATA_FAILURE, payload2: result.data });
                // } else {
                    dispatch({ type: LEADERBOARD_DATA_SUCCESS, payload: result.data })
                // }
            })
            .catch(() => {
                // console.log(err)
                dispatch({
                    type: LEADERBOARD_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching leaderboard data" },
                });
            });
    };
}