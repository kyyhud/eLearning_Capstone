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

export const registerFaculty = async (facultyData) => {
  try {
    let result = await axios.post(`${URL}/faculty`, facultyData);
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const viewAllFaculty = async () => {
  let result = await axios.get(`${URL}/faculty`);
  return result.data.data;
};

export const getFacultyById = async (id) => {
  try {
    let result = await axios.get(`${URL}/faculty/${id}`);
    return result.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const updateFaculty = async (id, updatedData) => {
  try {
    let result = await axios.put(`${URL}/faculty/${id}`, updatedData);
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};