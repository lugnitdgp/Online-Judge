import {
    EDITORIAL_REQUEST_PENDING,
    EDITORIAL_DATA_SUCCESS,
    EDITORIAL_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import { contestService } from "../../services/contestService"

export function getEditorial() {
    return function(dispatch) {
        dispatch({ type: EDITORIAL_REQUEST_PENDING });
        return contestService.getEditorialData()
            .then((result) => {
                // if (result.data.detail) {
                //     dispatch({ type: LEADERBOARD_DATA_FAILURE, payload2: result.data });
                // } else {
                    dispatch({ type:EDITORIAL_DATA_SUCCESS, payload: result })
                // }
            })
            .catch((err) => {
                console.log(err)
                dispatch({
                    type: EDITORIAL_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching editorial data" },
                });
            });
    };
}