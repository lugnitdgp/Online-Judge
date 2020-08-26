import Axios from "axios";

const getContestData = () => {
  return Axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contests`);
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

const getPersonalSubmissions = () => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/personalsubmissions?contest_id=${localStorage.code}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.token}`,
      },
    }
  ).then((resp) => resp.json());
};

const getSubmissions = () => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions?contest_id=${localStorage.code}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.token}`,
      },
    }
  )
    .then((resp) => resp.json())
};

const getQuestionsStatus = () => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getanswer?contest_id=${localStorage.code}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.token}`,
      },
    }
  )
    .then((response) => response.json())
//
};
const getQuestions = () => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions?contest_id=${localStorage.code}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.token}`,
      },
    }
  )
    .then((respon) => respon.json())
//
}
const getEditorialData = () => {
 return fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geteditorial`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.token}`,
      },body: JSON.stringify({
        contest_id: localStorage.code,
        q_id: getParameterByName("id"),
      })
    }
  )
    .then((resp) => resp.json())
}

function getParameterByName(name, url = window.location.href) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const contestService = {
  getContestData,
  getQuestions,
  getQuestionsStatus,
  getLeaderboardDataQues,
  getSubmissions,
  getLeaderboardData,
  getPersonalSubmissions,
  getEditorialData
};
