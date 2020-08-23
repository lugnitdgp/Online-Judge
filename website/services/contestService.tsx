import Axios from "axios";

const getContestData = () => {
  return Axios.get("https://ojapi.trennds.com/api/contests");
};

const getLeaderboardDataQues = () => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions?contest_id=${localStorage.code}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.token}`,
      },
    }
  ).then((resp) => resp.json());
};

const getLeaderboardData = () => {
  return Axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard?contest_id=${localStorage.code}`
  );
};

export const contestService = {
  getContestData,
  getLeaderboardDataQues,
  getLeaderboardData,
};
