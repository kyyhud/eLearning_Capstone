import axios from "axios";

let URL = "http://localhost:3000/api/users";

export const studentSignUp = async (userData) => {
  let result = await axios.post(`${URL}/signup`, userData);
  return result.data;
};

export const loginUser = async (credentials) => {
  let result = await axios.post(`${URL}/login`, credentials);
  return result.data;
};

export const registerFaculty = async (facultyData) => {
  const token = sessionStorage.getItem("token");
  try {
    let result = await axios.post(`${URL}/faculty`, facultyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${URL}/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to change password");
  }
  return data;
};

export const viewAllFaculty = async () => {
  const token = sessionStorage.getItem("token");
  let result = await axios.get(`${URL}/faculty`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data.data;
};

export const getFacultyById = async (id) => {
  const token = sessionStorage.getItem("token");
  try {
    let result = await axios.get(`${URL}/faculty/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const updateFaculty = async (id, updatedData) => {
  const token = sessionStorage.getItem("token");
  try {
    let result = await axios.put(`${URL}/faculty/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const deleteUser = async (id) => {
  const token = sessionStorage.getItem("token");
  try {
    let result = await axios.delete(`${URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const getAllStudents = async () => {
  const token = sessionStorage.getItem("token");
  let result = await axios.get(`${URL}/students`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data.data;
};

export const getStudentById = async (id) => {
  const token = sessionStorage.getItem("token");
  try {
    let result = await axios.get(`${URL}/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const updateStudent = async (id, updatedData) => {
  const token = sessionStorage.getItem("token");
  try {
    let result = await axios.put(`${URL}/students/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};
