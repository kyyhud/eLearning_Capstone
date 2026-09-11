import axios from "axios";
import { API_BASE_URL, createApiError, getAuthHeaders } from "./userApi.js";

const URL = `${API_BASE_URL}/enrollments`;

// Student requests enrollment in a course
const requestEnrollment = async (id) => {
  try {
    const response = await axios.post(`${URL}/courses/${id}/request`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

// Student gets their own enrollments
const getMyEnrollments = async () => {
  try {
    const response = await axios.get(
      `${URL}/my`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

// Student gets coursework for an approved enrollment
const getStudentCoursework = async (id) => {
  try {
    const response = await axios.get(`${URL}/courses/${id}/coursework`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

// Student marks a course content item as complete
const markContentComplete = async (id, contentId) => {
  try {
    const response = await axios.patch(`${URL}/courses/${id}/content/${contentId}/complete`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

// Faculty gets enrollment requests for their assigned courses
const getFacultyEnrollments = async () => {
  try {
    const response = await axios.get(`${URL}/faculty`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

// Faculty/admin approves or rejects an enrollment
const updateEnrollmentStatus = async (enrollmentId, status) => {
  try {
    const response = await axios.patch(`${URL}/${enrollmentId}/status`, { status }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export { requestEnrollment, getMyEnrollments, getFacultyEnrollments, updateEnrollmentStatus, getStudentCoursework, markContentComplete };
