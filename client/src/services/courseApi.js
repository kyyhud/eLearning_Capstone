import axios from "axios";

const URL = "http://localhost:3000/api/courses";

export const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createCourse = async (courseData) => {
  try {
    let result = await axios.post(URL, courseData, getAuthHeaders());
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
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
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const getCourseById = async (id) => {
  try {
    const result = await axios.get(`${URL}/${id}`, getAuthHeaders());
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const getFacultyCourses = async () => {
  try {
    const result = await axios.get(`${URL}/my-courses`, getAuthHeaders());
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const updateCourse = async (id, updatedData) => {
  try {
    const result = await axios.put(`${URL}/${id}/edit`, updatedData, getAuthHeaders());
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const uploadCourseContent = async (file, contentType) => {
  try {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("contentType", contentType);
    formData.append("file", file);
    const response = await axios.post(`${URL}/uploads`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to upload course content.");
  }
};
