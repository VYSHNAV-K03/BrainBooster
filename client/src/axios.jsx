// frontend/src/axios.js
import axios from "axios";

const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default instance;

export const base = "http://localhost:5000";
