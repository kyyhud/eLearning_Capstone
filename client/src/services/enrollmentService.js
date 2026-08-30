import axios from "axios";

const URL = "http://localhost:3000/api/enrollments";

// Student requests enrollment in a course
const requestEnrollment = async (courseId) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(
    `${URL}/courses/${courseId}/request`,
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

export { requestEnrollment, getMyEnrollments, getFacultyEnrollments, updateEnrollmentStatus };
