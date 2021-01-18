import {
    QUESTIONS_REQUEST_PENDING,
    QUESTIONS_DATA_SUCCESS,
    QUESTIONS_DATA_FAILURE,
} from "../actionTypes/contestActionType";

import { contestService } from "../../services/contestService"

export function getQuestionsData() {
    return function(dispatch) {
        dispatch({ type: QUESTIONS_REQUEST_PENDING });
        return contestService.getQuestions()
            .then((questions) => {
                return contestService.getQuestionsStatus()
                .then((status)=>{
                    var arr=[]
                    arr.push(questions,status)
                    dispatch({ type:QUESTIONS_DATA_SUCCESS, payload: arr })


                })
                // }
            })
            .catch((err) => {
                console.log(err)
                dispatch({
                    type: QUESTIONS_DATA_FAILURE,
                    payload: { detail: "Something wrong while fetching submissions data" },
                });
            });
    };
}
