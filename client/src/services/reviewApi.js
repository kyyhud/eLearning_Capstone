import axios from "axios";
import { API_BASE_URL, createApiError, getAuthHeaders } from "./userApi.js";

const API_URL = `${API_BASE_URL}/reviews`;

export const submitCourseReview = async (id, reviewData) => {
  try {
    const response = await axios.post(`${API_URL}/courses/${id}`, reviewData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const getCourseReviews = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/courses/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};
