import {
    PERSONAL_SUBMISSIONS_REQUEST_PENDING,
    PERSONAL_SUBMISSIONS_DATA_SUCCESS,
    PERSONAL_SUBMISSIONS_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import { contestService } from "../../services/contestService"

export function getPersonalSubmissionsData() {
    return function(dispatch) {
        dispatch({ type: PERSONAL_SUBMISSIONS_REQUEST_PENDING });
        return contestService.getPersonalSubmissions()
            .then((result) => {
                // if (result.data.detail) {
                //     dispatch({ type: LEADERBOARD_DATA_FAILURE, payload2: result.data });
                // } else {
                    dispatch({ type: PERSONAL_SUBMISSIONS_DATA_SUCCESS, payload: result })
                // }
            })
            .catch((err) => {
                console.log(err)
                dispatch({
                    type: PERSONAL_SUBMISSIONS_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching personal submissions data" },
                });
            });
    };
}