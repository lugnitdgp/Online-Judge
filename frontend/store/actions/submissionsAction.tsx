import {
    SUBMISSIONS_REQUEST_PENDING,
    SUBMISSIONS_DATA_SUCCESS,
    SUBMISSIONS_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import { contestService } from "../../services/contestService"

export function getSubmissionsData() {
    return function(dispatch) {
        dispatch({ type: SUBMISSIONS_REQUEST_PENDING });
        return contestService.getSubmissions()
            .then((result) => {
                // if (result.data.detail) {
                //     dispatch({ type: LEADERBOARD_DATA_FAILURE, payload2: result.data });
                // } else {
                    dispatch({ type:SUBMISSIONS_DATA_SUCCESS, payload: result })
                // }
            })
            .catch((err) => {
                console.log(err)
                dispatch({
                    type: SUBMISSIONS_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching submissions data" },
                });
            });
    };
}