import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://tinder-backend-000.herokuapp.com/",
});

export default axiosInstance;
