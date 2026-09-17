import axios from "axios";

const API = axios.create({
  baseURL: "https://online-realestate-property-finder-final-rdfh.onrender.com",
});

export default API;