import axios from "axios";
import { getAuthHeaders } from "./courseApi.js";

const URL = "http://localhost:3000/api/chat";

export const getCourseMessages = async (id) => {
  try {
    const response = await axios.get(`${URL}/courses/${id}/messages`, getAuthHeaders());
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const sendCourseMessage = async (id, message) => {
  try {
    const response = await axios.post(`${URL}/courses/${id}/messages`, { message }, getAuthHeaders());
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};
