import axios from "axios";

const API = axios.create({
  baseURL: "https://realestate-pro-2.onrender.com",
});

export default API;