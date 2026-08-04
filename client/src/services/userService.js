import axios from "axios";

let URL = "http://localhost:3000/api/users";

export const registerUser = async (userData) => {
  let result = await axios.post(`${URL}/register`, userData);
  return result.data;
};

export const loginUser = async (credentials) => {
  let result = await axios.post(`${URL}/login`, credentials);
  return result.data;
};
