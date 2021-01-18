import {
    INDI_QUES_REQUEST_PENDING,
    INDI_QUES_DATA_SUCCESS,
    INDI_QUES_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import { contestService } from "../../services/contestService"

export function getIndividualQuestionData() {
    return function(dispatch) {
        dispatch({ type: INDI_QUES_REQUEST_PENDING });
        return contestService.getQuestionData()
            .then((question) => {
                    dispatch({ type:INDI_QUES_DATA_SUCCESS, payload: question })
            })
            .catch((err) => {
                console.log(err)
                dispatch({
                    type: INDI_QUES_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching submissions data" },
                });
            });
    };
}
