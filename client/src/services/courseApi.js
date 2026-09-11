import axios from "axios";
import { API_BASE_URL, createApiError, getAuthHeaders } from "./userApi.js";

const URL = `${API_BASE_URL}/courses`;

export const createCourse = async (courseData) => {
  try {
    let result = await axios.post(URL, courseData, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const getCourses = async (filters = {}) => {
  try {
    let result = await axios.get(URL, {
      ...getAuthHeaders(),
      params: filters,
    });
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const getCourseById = async (id) => {
  try {
    const result = await axios.get(`${URL}/${id}`, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const getCourseContentFile = async (courseId, contentId) => {
  try {
    const response = await axios.get(`${URL}/${courseId}/content/${contentId}`, {
      ...getAuthHeaders(),
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw createApiError(error, "Unable to open course content");
  }
};

export const getFacultyCourses = async () => {
  try {
    const result = await axios.get(`${URL}/my-courses`, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const updateCourse = async (id, updatedData) => {
  try {
    const result = await axios.put(`${URL}/${id}/edit`, updatedData, getAuthHeaders());
    return result.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const uploadCourseContent = async (file, contentType) => {
  try {
    const formData = new FormData();
    formData.append("contentType", contentType);
    formData.append("file", file);
    const response = await axios.post(`${URL}/uploads`, formData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error, "Failed to upload course content.");
  }
};
