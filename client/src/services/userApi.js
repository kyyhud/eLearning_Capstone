import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
export const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
export const createApiError = (error, fallbackMessage) => {
  if (error.response || fallbackMessage) {
    return new Error(error.response?.data?.error || fallbackMessage || error.message, { cause: error });
  }
  return error;
};
const URL = `${API_BASE_URL}/users`;

export const studentSignUp = async (userData) => {
  let result = await axios.post(`${URL}/signup`, userData);
  return result.data;
};

export const loginUser = async (credentials) => {
  let result = await axios.post(`${URL}/login`, credentials);
  return result.data;
};

export const getCurrentUser = async () => {
  const result = await axios.get(`${URL}/me`, getAuthHeaders());
  return result.data;
};

export const registerFaculty = async (facultyData) => {
  try {
    let result = await axios.post(`${URL}/faculty`, facultyData, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const changePassword = async (passwordData) => {
  const response = await fetch(`${URL}/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders().headers,
    },
    body: JSON.stringify(passwordData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to change password");
  }
  return data;
};

export const viewAllFaculty = async () => {
  let result = await axios.get(`${URL}/faculty`, getAuthHeaders());
  return result.data;
};

export const getFacultyById = async (id) => {
  try {
    let result = await axios.get(`${URL}/faculty/${id}`, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const updateFaculty = async (id, updatedData) => {
  try {
    let result = await axios.put(`${URL}/faculty/${id}`, updatedData, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const deleteUser = async (id) => {
  try {
    let result = await axios.delete(`${URL}/${id}`, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const getAllStudents = async () => {
  let result = await axios.get(`${URL}/students`, getAuthHeaders());
  return result.data;
};

export const getStudentById = async (id) => {
  try {
    let result = await axios.get(`${URL}/students/${id}`, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const updateStudent = async (id, updatedData) => {
  try {
    let result = await axios.put(`${URL}/students/${id}`, updatedData, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};
