import Axios from "axios";

const getContestData = () => {
    return Axios.get("https://ojapi.trennds.com/api/contests");
};

export const contestService = {
    getContestData,
};