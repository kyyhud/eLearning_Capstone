import axios from "axios";

let URL = "http://localhost:3000/api/courses";

export const createCourse = async (courseData) => {
  try {
    let result = await axios.post(`${URL}/create`, courseData);
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const viewCourseByTitle = async (title) => {
  try {
    let result = await axios.get(`${URL}/title/${title}`);
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const viewAllCourses = async () => {
  try {
    let result = await axios.get(`${URL}/all`);
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
  }
};