import axios from "axios";

const API_URL = "http://localhost:3000/api/reviews";

const getAuthConfig = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const submitCourseReview = async (id, reviewData) => {
  const response = await axios.post(`${API_URL}/courses/${id}`, reviewData, getAuthConfig());
  return response.data;
};

export const getCourseReviews = async (id) => {
  const response = await axios.get(`${API_URL}/courses/${id}`, getAuthConfig());
  return response.data;
};
