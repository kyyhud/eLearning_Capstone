import axios from "axios";

let URL = "http://localhost:3000/api/courses";

const getAuthHeaders = () => {
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

export const viewCourses = async (filters = {}) => {
  try {
    let result = await axios.get(URL, {
      ...getAuthHeaders(),
      params: filters,
    });
    return result.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const viewCourseByCourseId = async (courseId) => {
  try {
    const result = await axios.get(`${URL}/${courseId}`, getAuthHeaders());
    return result.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const accessFacultyCourses = async () => {
  try {
    const result = await axios.get(`${URL}/my-courses`, getAuthHeaders());
    return result.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const deleteCourseByCourseId = async (courseId) => {
  try {
    const result = await axios.delete(`${URL}/${courseId}`, getAuthHeaders());
    return result.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};