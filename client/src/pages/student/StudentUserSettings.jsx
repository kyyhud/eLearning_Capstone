import { useState, useEffect } from "react";
import { changePassword, getStudentById, updateStudent } from "../../services/userApi.js";

const getStudentSettingsData = async (id) => {
  const response = await getStudentById(id);
  const student = response.data;
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email || "",
    phone: student.phone || "",
    studentId: student.studentProfile?.studentId || "",
    isActive: student.isActive ?? true,
    emergencyContactName: student.studentProfile?.emergencyContact?.name || "",
    emergencyContactRelationship: student.studentProfile?.emergencyContact?.relationship || "",
    emergencyContactPhone: student.studentProfile?.emergencyContact?.phone || "",
    chatAutoRefresh: student.preferences?.chatAutoRefresh ?? true,
  };
};

function StudentUserSettings() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const id = user?._id;

  const emptyForm = {
    phone: "",
    studentId: "",
    isActive: true,
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    chatAutoRefresh: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadStudent = async () => {
      try {
        const studentData = await getStudentSettingsData(id);
        if (!cancelled) {
          setFormData((prevData) => ({
            ...prevData,
            ...studentData,
          }));
          setMessage("");
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message);
        }
      }
    };
    loadStudent();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await updateStudent(id, {
        phone: formData.phone,
        studentProfile: {
          emergencyContact: {
            name: formData.emergencyContactName,
            relationship: formData.emergencyContactRelationship,
            phone: formData.emergencyContactPhone,
          },
        },
        preferences: {
          chatAutoRefresh: formData.chatAutoRefresh,
        },
      });
      setMessage(response.message);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCancelEdit = async () => {
    setIsEditing(false);
    setMessage("");
    try {
      const studentData = await getStudentSettingsData(id);
      setFormData((previousData) => ({
        ...previousData,
        ...studentData,
      }));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage(response.message);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h3>User Settings for {formData.email}</h3>
      <p>Student ID: {formData.studentId}</p>
      <p>Status: {formData.isActive ? "Active" : "Inactive"}</p>

      <section>
        <hr />
        <h3>User Information</h3>
        <form onSubmit={handleInfoSubmit}>
          <div>
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div>
            <p>Emergency Contact:</p>
            <div>
              <label htmlFor="emergencyContactName">Name</label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="emergencyContactRelationship">Relationship</label>
              <input
                type="text"
                id="emergencyContactRelationship"
                name="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="emergencyContactPhone">Phone</label>
              <input
                type="text"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <h4>Discussion Settings</h4>
            <div>
              <label>
                <input type="checkbox" name="chatAutoRefresh" checked={formData.chatAutoRefresh} onChange={handleChange} disabled={!isEditing} />
                Automatically refresh course discussions
              </label>
            </div>
          </div>
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
          {isEditing && (
            <>
              <button type="submit">Save Updates</button>
              {" | "}
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </>
          )}
        </form>

        <hr />
        <h3>Update Password</h3>
        <form onSubmit={handleChangePassword}>
          <div>
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit">Change Password</button>
        </form>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>
    </div>
  );
}

export default StudentUserSettings;
