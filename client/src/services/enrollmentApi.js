import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "./userApi.js";

const URL = `${API_BASE_URL}/enrollments`;

// Student requests enrollment in a course
const requestEnrollment = async (id) => {
  const response = await axios.post(`${URL}/courses/${id}/request`, {}, getAuthHeaders());
  return response.data;
};

// Student gets their own enrollments
const getMyEnrollments = async () => {
  const response = await axios.get(`${URL}/my`, getAuthHeaders());
  return response.data;
};

// Student gets coursework for an approved enrollment
const getStudentCoursework = async (id) => {
  const response = await axios.get(`${URL}/courses/${id}/coursework`, getAuthHeaders());
  return response.data;
};

// Student marks a course content item as complete
const markContentComplete = async (id, contentId) => {
  const response = await axios.patch(`${URL}/courses/${id}/content/${contentId}/complete`, {}, getAuthHeaders());
  return response.data;
};

// Faculty gets enrollment requests for their assigned courses
const getFacultyEnrollments = async () => {
  const response = await axios.get(`${URL}/faculty`, getAuthHeaders());
  return response.data;
};

// Faculty/admin approves or rejects an enrollment
const updateEnrollmentStatus = async (enrollmentId, status) => {
  const response = await axios.patch(`${URL}/${enrollmentId}/status`, { status }, getAuthHeaders());
  return response.data;
};

export { requestEnrollment, getMyEnrollments, getFacultyEnrollments, updateEnrollmentStatus, getStudentCoursework, markContentComplete };
