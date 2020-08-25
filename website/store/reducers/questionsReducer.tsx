import {
    QUESTIONS_REQUEST_PENDING,
    QUESTIONS_DATA_SUCCESS,
    QUESTIONS_DATA_FAILURE,
} from "../actionTypes/contestActionType";
import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import CloseTwoToneIcon from "@material-ui/icons/CloseTwoTone";
const initialState = {
    questions: [],
    loaded: false,
    ended: false,
    timestamp: 0,
    message: "",
    error: "",
  };

  function questionsReducer(state = initialState, action) {
    switch (action.type) {
        case QUESTIONS_REQUEST_PENDING:
            {
                return Object.assign({}, state, {
                    loaded: false,
                    error: "",
                    message: "",
                });
            }

        case QUESTIONS_DATA_SUCCESS:
            {   var qstatus= action.payload[1]
                var questionsvar = action.payload[0]
                questionsvar.map((question) => {
                    console.log(question);
                    question.icon = <div></div>;
                        qstatus.map((ques) => {
                      if (ques.ques_name === question.question_name) {
                        if (ques.correct >= 1) question.icon = <CheckTwoToneIcon />;
                        else question.icon = <CloseTwoToneIcon />;
                      }
                    });
                  });
                  var today = Date.now();
                  var start = localStorage.start * 1000;
                  var end = localStorage.end * 1000;
                  console.log(start + "   " + today + "  " + end);
                  if (start <= today && end > today) {

                    return Object.assign({}, state, {
                        loaded: true,
                        timestamp: end,
                        message: "The Contest ends in",
                        questions: questionsvar,
                        ended:false
                    });
                    
                  } else if (start <= today && end <= today) {
                    return Object.assign({}, state, {
                        loaded: true,
                        timestamp: 0,ended:true,
                        message: "The Contest has ended",
                        questions: questionsvar
                    });
                  } else if (start > today) {
                    return Object.assign({}, state, {
                        loaded: true,
                        ended:false,
                        timestamp: start,
                        message: "TThe Contest begins in",
                        questions: questionsvar
                    });
                }
                      
               
                return null;
            }

        case QUESTIONS_DATA_FAILURE:
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

export default questionsReducer;