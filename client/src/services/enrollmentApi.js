import axios from "axios";

const URL = "http://localhost:3000/api/enrollments";

// Student requests enrollment in a course
const requestEnrollment = async (id) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(
    `${URL}/courses/${id}/request`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// Student gets their own enrollments
const getMyEnrollments = async () => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Student gets coursework for an approved enrollment
const getStudentCoursework = async (id) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(
    `${URL}/courses/${id}/coursework`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// Student marks a course content item as complete
const markContentComplete = async (id, contentId) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.patch(
    `${URL}/courses/${id}/content/${contentId}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// Faculty gets enrollment requests for their assigned courses
const getFacultyEnrollments = async () => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${URL}/faculty`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Faculty/admin approves or rejects an enrollment
const updateEnrollmentStatus = async (enrollmentId, status) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.patch(
    `${URL}/${enrollmentId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export { requestEnrollment, getMyEnrollments, getFacultyEnrollments, updateEnrollmentStatus, getStudentCoursework, markContentComplete };
