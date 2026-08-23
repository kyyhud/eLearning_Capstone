import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStudentById, updateStudent } from "../../services/userService.js";

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

function StudentProfilePage() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user.typeOfUser === "admin";

  useEffect(() => {
    setIsEditing(false);
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      const student = await getStudentById(id);
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone || "",
        bio: student.studentProfile?.bio || "",
        fieldOfStudy: student.studentProfile?.fieldOfStudy || "",
        careerGoal: student.studentProfile?.careerGoal || "",
        skills: student.studentProfile?.skills?.join(", ") || "",
        certifications:
          student.studentProfile?.certifications?.map((cert) => ({
            name: cert.name || "",
            issuer: cert.issuer || "",
            dateEarned: cert.dateEarned ? cert.dateEarned.split("T")[0] : "",
          })) || [],
        isActive: student.isActive,
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadStudent();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      setMessage(error.message);
    }
  };

  return (
    <>
      <h3>{isAdmin ? "Student Management" : "Student Profile"}</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}
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
        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
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
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} disabled={!isEditing} />
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

export default StudentProfilePage;
