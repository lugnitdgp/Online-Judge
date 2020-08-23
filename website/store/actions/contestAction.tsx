import {
    CONTEST_REQUEST_PENDING,
    CONTEST_DATA_PENDING,
    CONTEST_DATA_SUCCESS,
    CONTEST_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import { contestService } from "../../services/contestService"

export function getContest() {
    return function(dispatch) {
        dispatch({ type: CONTEST_REQUEST_PENDING });
        return contestService.getContestData()
            .then((result) => {
                if (result.data.detail) {
                    dispatch({ type: CONTEST_DATA_FAILURE, payload: result.data });
                } else {
                    dispatch({ type: CONTEST_DATA_SUCCESS, payload: result.data })
                }
            })
            .catch((err) => {
                dispatch({
                    type: CONTEST_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching contests" },
                });
            });
    };
}