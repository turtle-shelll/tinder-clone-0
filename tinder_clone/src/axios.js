import Axios from "axios";

const MAIN_URL = "https://tinder-backend-000.herokuapp.com";
// const MAIN_URL = "http://localhost:5000";
// const MAIN_URL = "";
const axios = Axios.create({
  baseURL: MAIN_URL,
});

// export default axiosInstance;
export { MAIN_URL, axios };
