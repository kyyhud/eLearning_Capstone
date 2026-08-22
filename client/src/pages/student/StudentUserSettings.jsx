import { useState, useEffect } from "react";
import { changePassword, getStudentById, updateStudent } from "../../services/userService.js";

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
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const loadStudent = async () => {
    try {
      const student = await getStudentById(id);
      setFormData((prev) => ({
        ...prev,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email || "",
        phone: student.phone || "",
        studentId: student.studentProfile?.studentId || "",
        isActive: student.isActive,
        emergencyContactName: student.studentProfile?.emergencyContact?.name || "",
        emergencyContactRelationship: student.studentProfile?.emergencyContact?.relationship || "",
        emergencyContactPhone: student.studentProfile?.emergencyContact?.phone || "",
      }));
    } catch (error) {
      setMessage(error.message);
    }
  };
  useEffect(() => {
    loadStudent();
  }, []);

  const handlePersonalInfoSubmit = async (e) => {
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
      });
      setMessage(response.message);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadStudent();
  };

  const handleSubmit = async (e) => {
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
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h3>
        User Settings for {formData.email}
      </h3>
      <p>Student ID: {formData.studentId}</p>
      <p>Status: {formData.isActive ? "Active" : "Inactive"}</p>
      <section>
        <h3>Personal Information</h3>
        <form onSubmit={handlePersonalInfoSubmit}>
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
          </div>
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit Personal Information
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
        <h3>Account Security</h3>
        <form onSubmit={handleSubmit}>
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
