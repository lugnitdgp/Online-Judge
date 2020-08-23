import {
  LEADERBOARD_QUES_REQUEST_PENDING,
  LEADERBOARD_QUES_DATA_SUCCESS,
  LEADERBOARD_QUES_DATA_FAILURE,
  LEADERBOARD_REQUEST_PENDING,
  LEADERBOARD_DATA_SUCCESS,
  LEADERBOARD_DATA_FAILURE,
} from "../actionTypes/contestActionType";

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
    case LEADERBOARD_QUES_REQUEST_PENDING: {
      return Object.assign({}, state, {
        loaded: false,
        error: "",
        message: "",
      });
    }

    case LEADERBOARD_QUES_DATA_SUCCESS: {
      var columns = [
        {
          name: "rank",
          label: "RANK",
          options: {
            filter: false,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                textAlign: "center",
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
            setCellProps: () => ({
              style: { fontWeight: "900", textAlign: "center" },
            }),
          },
        },
        {
          name: "image",
          label: " ",
          options: {
            filter: false,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
          },
        },
        {
          name: "name",
          label: "NAME",
          options: {
            filter: true,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                textAlign: "center",
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
            setCellProps: () => ({
              style: { fontWeight: "900", textAlign: "center" },
            }),
          },
        },
        {
          name: "score",
          label: "SCORE",
          options: {
            filter: true,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                textAlign: "center",
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
            setCellProps: () => ({
              style: { fontWeight: "900", textAlign: "center" },
            }),
          },
        },
      ];

      action.payload.map((ques) => {
        var newCol = {
          name: `${ques.question_name}`,
          label: `${ques.question_name}`,
          options: {
            filter: false,
            sort: false,
            setCellHeaderProps: () => ({
              style: {
                textAlign: "center",
                background: "#000",
                color: "#fff",
                textDecoration: "bold",
              },
            }),
            setCellProps: () => ({
              style: { fontWeight: "900", textAlign: "center" },
            }),
          },
        };

        columns.push(newCol);
      });

      // console.log(action.payload)
      return Object.assign({}, state, {
        leaderboard: columns,
        loaded: false,
      });
    }

    case LEADERBOARD_DATA_SUCCESS: {
      // console.log(action.payload)

      return Object.assign({}, state, {
        data: action.payload,
        loaded: true,
      });
    }

    case LEADERBOARD_DATA_FAILURE: {
      return Object.assign({}, state, {
        error: action.payload.detail,
        loaded: true,
      });
    }
    case LEADERBOARD_QUES_DATA_FAILURE: {
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
