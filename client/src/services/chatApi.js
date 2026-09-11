import axios from "axios";
import { API_BASE_URL, createApiError, getAuthHeaders } from "./userApi.js";

const URL = `${API_BASE_URL}/chat`;

export const getCourseMessages = async (id) => {
  try {
    const response = await axios.get(`${URL}/courses/${id}/messages`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const sendCourseMessage = async (id, message) => {
  try {
    const response = await axios.post(`${URL}/courses/${id}/messages`, { message }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};
