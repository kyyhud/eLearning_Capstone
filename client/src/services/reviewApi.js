import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "./userApi.js";

const API_URL = `${API_BASE_URL}/reviews`;

export const submitCourseReview = async (id, reviewData) => {
  const response = await axios.post(`${API_URL}/courses/${id}`, reviewData, getAuthHeaders());
  return response.data;
};

export const getCourseReviews = async (id) => {
  const response = await axios.get(`${API_URL}/courses/${id}`, getAuthHeaders());
  return response.data;
};
