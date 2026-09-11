import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFacultyById, updateFaculty } from "../../services/userApi.js";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  facultyId: "",
  bio: "",
  department: "",
  title: "",
  specialization: "",
  isActive: true,
};

const getFacultyFormData = async (id) => {
  const response = await getFacultyById(id);
  const facultyMember = response.data;
  return {
    firstName: facultyMember.firstName,
    lastName: facultyMember.lastName,
    email: facultyMember.email,
    phone: facultyMember.phone || "",
    isActive: facultyMember.isActive ?? true,
    facultyId: facultyMember.facultyProfile?.facultyId || "",
    department: facultyMember.facultyProfile?.department || "",
    title: facultyMember.facultyProfile?.title || "",
    specialization: facultyMember.facultyProfile?.specialization || "",
    bio: facultyMember.facultyProfile?.bio || "",
  };
};

function FacultyProfile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user.typeOfUser === "admin";

  useEffect(() => {
    let cancelled = false;
    const loadFaculty = async () => {
      try {
        const facultyData = await getFacultyFormData(id);
        if (!cancelled) {
          setFormData(facultyData);
          setIsEditing(false);
          setError("");
          setMessage("");
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      }
    };
    loadFaculty();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancelEdit = async () => {
    setIsEditing(false);
    setError("");
    setMessage("");
    try {
      const facultyData = await getFacultyFormData(id);
      setFormData(facultyData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      const facultyData = isAdmin
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            isActive: formData.isActive,
            phone: formData.phone,
            facultyProfile: {
              department: formData.department,
              title: formData.title,
              specialization: formData.specialization,
              bio: formData.bio,
            },
          }
        : {
            phone: formData.phone,
            facultyProfile: {
              bio: formData.bio,
            },
          };
      await updateFaculty(id, facultyData);
      setMessage("Faculty member updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <h3>{isAdmin ? "Faculty Management" : "Faculty Profile"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <h4>{isEditing ? "Edit Profile" : "Profile Details"}</h4>
      <form onSubmit={handleSubmit}>
        <label htmlFor="facultyId">Faculty ID:</label>
        <input type="text" id="facultyId" name="facultyId" value={formData.facultyId} onChange={handleChange} disabled />
        <br />
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditing || !isAdmin} required />
        <br />
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditing || !isAdmin} required />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing || !isAdmin} required />
        <br />
        <label htmlFor="phone">Phone:</label>
        <input type="text" id="phone" name="phone" maxLength={13} value={formData.phone} onChange={handleChange} disabled={!isEditing} />
        <br />
        <label htmlFor="department">Department:</label>
        <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} disabled={!isEditing || !isAdmin} />
        <br />
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} disabled={!isEditing || !isAdmin} />
        <br />
        <label htmlFor="specialization">Specialization:</label>
        <input
          type="text"
          id="specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          disabled={!isEditing || !isAdmin}
        />
        <br />
        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" maxLength={500} value={formData.bio} onChange={handleChange} disabled={!isEditing} />
        <br />
        {isAdmin && (
          <>
            <label>
              Status: {formData.isActive ? "Active" : "Inactive"}
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    isActive: e.target.checked,
                  }))
                }
                disabled={!isEditing}
              />
            </label>
            <br />
          </>
        )}
        {!isEditing && (
          <>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          {(isAdmin && !isEditing) && (
            <>
            {" | "}
            <button type="button" onClick={() => navigate(-1)}>
              Back
            </button>
            </>
          )}
          </>
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
    </>
  );
}

export default FacultyProfile;
