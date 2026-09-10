import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById, updateStudent } from "../../services/userApi.js";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bio: "",
  fieldOfStudy: "",
  careerGoal: "",
  skills: "",
  certifications: [],
  isActive: true,
};

const getStudentFormData = async (id) => {
  const response = await getStudentById(id);
  const student = response.data;
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    phone: student.phone || "",
    bio: student.studentProfile?.bio || "",
    fieldOfStudy: student.studentProfile?.fieldOfStudy || "",
    careerGoal: student.studentProfile?.careerGoal || "",
    skills: student.studentProfile?.skills?.join(", ") || "",
    certifications:
      student.studentProfile?.certifications?.map((certification) => ({
        name: certification.name || "",
        issuer: certification.issuer || "",
        dateEarned: certification.dateEarned ? certification.dateEarned.split("T")[0] : "",
      })) || [],
    isActive: student.isActive ?? true,
  };
};

function StudentProfile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user.typeOfUser === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const loadStudent = async () => {
      try {
        const studentData = await getStudentFormData(id);
        if (!cancelled) {
          setFormData(studentData);
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
    loadStudent();
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

  const handleCertificationChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedCertifications = [...prevData.certifications];
      updatedCertifications[index] = {
        ...updatedCertifications[index],
        [field]: value,
      };
      return {
        ...prevData,
        certifications: updatedCertifications,
      };
    });
  };
  const addCertification = () => {
    setFormData((prevData) => ({
      ...prevData,
      certifications: [
        ...prevData.certifications,
        {
          name: "",
          issuer: "",
          dateEarned: "",
        },
      ],
    }));
  };
  const removeCertification = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      certifications: prevData.certifications.filter((_, certIndex) => certIndex !== index),
    }));
  };

  const handleCancelEdit = async () => {
    setIsEditing(false);
    setError("");
    setMessage("");
    try {
      const studentData = await getStudentFormData(id);
      setFormData(studentData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");
      const studentData = isAdmin
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            isActive: formData.isActive,
            phone: formData.phone,
            studentProfile: {
              fieldOfStudy: formData.fieldOfStudy,
              careerGoal: formData.careerGoal,
              skills: skillsArray,
              certifications: formData.certifications,
              bio: formData.bio,
            },
          }
        : {
            phone: formData.phone,
            studentProfile: {
              fieldOfStudy: formData.fieldOfStudy,
              careerGoal: formData.careerGoal,
              skills: skillsArray,
              certifications: formData.certifications,
              bio: formData.bio,
            },
          };
      await updateStudent(id, studentData);
      setMessage("Student updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <>
      <h3>{isAdmin ? "Student Management" : "Student Profile"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <h4>{isEditing ? "Edit Profile" : "Profile Details"}</h4>

      <form onSubmit={handleSubmit}>
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
        <label htmlFor="fieldOfStudy">Field of Study:</label>
        <input type="text" id="fieldOfStudy" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} disabled={!isEditing} />
        <br />
        <label htmlFor="careerGoal">Career Goal:</label>
        <input type="text" id="careerGoal" name="careerGoal" value={formData.careerGoal} onChange={handleChange} disabled={!isEditing} />
        <br />
        <label htmlFor="skills">Skills (comma separated):</label>
        <input type="text" id="skills" name="skills" value={formData.skills} onChange={handleChange} disabled={!isEditing} />
        <br />
        <div>
          <label>Certifications: {formData.certifications.length === 0 && <span> None</span>} </label>
          {formData.certifications.map((certification, index) => (
            <div key={certification._id || index}>
              <input
                type="text"
                value={certification.name}
                placeholder="Certification name"
                onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                disabled={!isEditing}
                required
              />
              <input
                type="text"
                value={certification.issuer}
                placeholder="Issuer"
                onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                disabled={!isEditing}
                required
              />
              <input
                type="date"
                value={certification.dateEarned}
                onChange={(e) => handleCertificationChange(index, "dateEarned", e.target.value)}
                disabled={!isEditing}
                required
              />
              {isEditing && (
                <button type="button" onClick={() => removeCertification(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button type="button" onClick={addCertification}>
              Add Certification
            </button>
          )}
        </div>
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
            {" | "}
            <button type="button" onClick={() => navigate(-1)}>
              Back
            </button>
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

export default StudentProfile;
