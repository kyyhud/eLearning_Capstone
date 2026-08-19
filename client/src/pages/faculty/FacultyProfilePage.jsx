import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFacultyById, updateFaculty } from "../../services/userService.js";

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

function FacultyProfilePage() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user.typeOfUser === "admin";

  useEffect(() => {
    setIsEditing(false);
    loadFaculty();
  }, [id]);

  const loadFaculty = async () => {
    try {
      const facultyMember = await getFacultyById(id);
      setFormData({
        firstName: facultyMember.firstName,
        lastName: facultyMember.lastName,
        email: facultyMember.email,
        phone: facultyMember.phone || "",
        facultyId: facultyMember.facultyProfile?.facultyId || "",
        department: facultyMember.facultyProfile?.department || "",
        title: facultyMember.facultyProfile?.title || "",
        specialization: facultyMember.facultyProfile?.specialization || "",
        bio: facultyMember.facultyProfile?.bio || "",
        isActive: facultyMember.isActive,
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadFaculty();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      facultyProfile: {
        phone: formData.phone,
        bio: formData.bio,
      },
    };
      await updateFaculty(id, facultyData);
      setMessage("Faculty member updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <>
      <h3>{isAdmin ? "Faculty Management" : "Faculty Profile"}</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <h4>{isEditing ? "Edit Profile" : "Profile Details"}</h4>
      <form onSubmit={handleSubmit}>
        Faculty ID: <input type="text" name="facultyId" value={formData.facultyId} onChange={handleChange} disabled={!isEditing || !isAdmin} />
        <br />
        First Name: <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditing || !isAdmin} required />
        <br />
        Last Name: <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditing || !isAdmin} required />
        <br />
        Email: <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing || !isAdmin} required />
        <br />
        Phone: <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
        <br />
        Department: <input type="text" name="department" value={formData.department} onChange={handleChange} disabled={!isEditing || !isAdmin} />
        <br />
        Title: <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={!isEditing || !isAdmin} />
        <br />
        Specialization: <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} disabled={!isEditing || !isAdmin} />
        <br />
        Bio: <textarea name="bio" value={formData.bio} onChange={handleChange} disabled={!isEditing} />
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
    </>
  );
}

export default FacultyProfilePage;
