import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, updateCourse, uploadCourseContent } from "../../services/courseApi.js";
import { viewAllFaculty } from "../../services/userApi.js";

const emptyForm = {
  title: "",
  description: "",
  durationWeeks: "",
  faculty: "",
  status: "draft",
  sections: [],
};

function CourseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [courseId, setCourseId] = useState("");
  const [faculty, setFaculty] = useState([]);
  const [uploadingContent, setUploadingContent] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user?.typeOfUser === "admin";
  const isArchivedForFaculty = !isAdmin && formData.status === "archived";

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setError("");
        const response = await getCourseById(id);
        const course = response.data;
        setCourseId(course.courseId);
        setFormData({
          status: course.status || "draft",
          title: course.title || "",
          description: course.description || "",
          durationWeeks: course.durationWeeks ?? "",
          faculty: course.faculty?._id || "",
          sections: course.sections || [],
        });
      } catch (error) {
        setError(error.message);
      }
    };
    loadCourse();
    if (isAdmin) {
      const loadFaculty = async () => {
        try {
          const response = await viewAllFaculty();
          setFaculty(response.data);
        } catch (error) {
          setError(error.message);
        }
      };
      loadFaculty();
    }
  }, [id, isAdmin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (isArchivedForFaculty) {
      setError("You cannot edit an archived course.");
      return;
    }
    try {
      setError("");
      const sections = formData.sections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));
      const updateData = isAdmin
        ? {
            ...formData,
            sections,
          }
        : {
            description: formData.description,
            status: formData.status,
            sections,
          };
      await updateCourse(id, updateData);
      setMessage("Course updated successfully.");
    } catch (error) {
      setError(error.message);
    }
  };
  // Section management functions: add, change, remove, move sections
  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: "",
          description: "",
          order: prev.sections.length + 1,
          content: [],
        },
      ],
    }));
  };

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sectionIndex) =>
        sectionIndex === index
          ? {
              ...section,
              [name]: value,
            }
          : section,
      ),
    }));
  };

  const handleRemoveSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections
        .filter((_, sectionIndex) => sectionIndex !== index)
        .map((section, sectionIndex) => ({
          ...section,
          order: sectionIndex + 1,
        })),
    }));
  };

  const handleMoveSection = (index, direction) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= sections.length) {
        return prev;
      }
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      return {
        ...prev,
        sections: sections.map((section, sectionIndex) => ({
          ...section,
          order: sectionIndex + 1,
        })),
      };
    });
  };
  // Content management functions: add, change, remove content
  const handleAddContent = (sectionIndex) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, currentSectionIndex) =>
        currentSectionIndex === sectionIndex
          ? {
              ...section,
              content: [
                ...(section.content || []),
                {
                  title: "",
                  description: "",
                  type: "",
                  resourceUrl: "",
                  fileName: "",
                  mimeType: "",
                  isRequired: true,
                },
              ],
            }
          : section,
      ),
    }));
  };

  const handleContentChange = (sectionIndex, contentIndex, e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, currentSectionIndex) =>
        currentSectionIndex === sectionIndex
          ? {
              ...section,
              content: (section.content || []).map((contentItem, currentContentIndex) =>
                currentContentIndex === contentIndex
                  ? name === "type"
                    ? {
                        ...contentItem,
                        type: value,
                        resourceUrl: "",
                        fileName: "",
                        mimeType: "",
                      }
                    : {
                        ...contentItem,
                        [name]: inputType === "checkbox" ? checked : value,
                      }
                  : contentItem,
              ),
            }
          : section,
      ),
    }));
  };

  const handleMoveContent = (sectionIndex, contentIndex, direction) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const section = {
        ...sections[sectionIndex],
      };
      const content = [...(section.content || [])];
      const newIndex = contentIndex + direction;
      if (newIndex < 0 || newIndex >= content.length) {
        return prev;
      }
      [content[contentIndex], content[newIndex]] = [content[newIndex], content[contentIndex]];
      section.content = content;
      sections[sectionIndex] = section;
      return {
        ...prev,
        sections,
      };
    });
  };

  const handleRemoveContent = (sectionIndex, contentIndex) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, currentSectionIndex) =>
        currentSectionIndex === sectionIndex
          ? {
              ...section,
              content: (section.content || []).filter((_, currentContentIndex) => currentContentIndex !== contentIndex),
            }
          : section,
      ),
    }));
  };

  // File upload handling
  const getAcceptedFileTypes = (contentType) => {
    switch (contentType) {
      case "document":
        return ".pdf,.doc,.docx,.txt";
      case "presentation":
        return ".ppt,.pptx,.pdf";
      case "video":
      case "recording":
        return ".mp4,.webm,.mov";
      default:
        return "";
    }
  };
  // Handle file upload for course content
  const handleFileUpload = async (sectionIndex, contentIndex, file, contentType) => {
    if (!file) return;
    const uploadKey = `${sectionIndex}-${contentIndex}`;
    try {
      setError("");
      setUploadingContent(uploadKey);
      const response = await uploadCourseContent(file, contentType);
      const uploadedFile = response.data;
      setFormData((prev) => ({
        ...prev,
        sections: prev.sections.map((section, currentSectionIndex) =>
          currentSectionIndex === sectionIndex
            ? {
                ...section,
                content: (section.content || []).map((contentItem, currentContentIndex) =>
                  currentContentIndex === contentIndex
                    ? {
                        ...contentItem,
                        fileName: uploadedFile.fileName,
                        resourceUrl: uploadedFile.resourceUrl,
                        mimeType: uploadedFile.mimeType,
                      }
                    : contentItem,
                ),
              }
            : section,
        ),
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setUploadingContent("");
    }
  };

  return (
    <main>
      <h3>Edit Course</h3>
      <form onSubmit={handleSubmit}>
        <section>
          <div>
            <label htmlFor="courseId">Course ID</label>
            <input type="text" id="courseId" value={courseId} disabled />
          </div>
          <div>
            <label htmlFor="title">Course Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} disabled={!isAdmin} required />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} disabled={isArchivedForFaculty} />
          </div>
          <div>
            <label htmlFor="durationWeeks">Duration</label>
            <input type="number" id="durationWeeks" name="durationWeeks" value={formData.durationWeeks} onChange={handleChange} disabled={!isAdmin} required />
          </div>
          {isAdmin && (
            <div>
              <label htmlFor="faculty">Faculty</label>
              <select id="faculty" name="faculty" value={formData.faculty} onChange={handleChange} required>
                <option value="">Select Faculty</option>
                {faculty.map((facultyMember) => (
                  <option key={facultyMember._id} value={facultyMember._id}>
                    {facultyMember.firstName} {facultyMember.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} disabled={!isAdmin && formData.status === "archived"}>
              {" "}
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              {(isAdmin || formData.status === "archived") && <option value="archived">Archived</option>}
            </select>
          </div>
        </section>
        {/* Course sections management */}
        <br />
        <section>
          <h3>Course Sections</h3>
          {formData.sections.length === 0 && <p>No course sections have been added yet.</p>}

          {formData.sections.map((section, index) => (
            <div key={section._id || `section-${index}`}>
              <hr />
              <h4>Section {index + 1}</h4>
              <button type="button" onClick={() => handleMoveSection(index, -1)} disabled={index === 0}>
                ↑
              </button>
              <button type="button" onClick={() => handleMoveSection(index, 1)} disabled={index === formData.sections.length - 1}>
                ↓
              </button>
              <button type="button" onClick={() => handleRemoveSection(index)}>
                Remove Section
              </button>
              <div>
                <label htmlFor={`section-title-${index}`}>Title</label>
                <input type="text" id={`section-title-${index}`} name="title" value={section.title} onChange={(e) => handleSectionChange(index, e)} required />
              </div>
              <div>
                <label htmlFor={`section-description-${index}`}>Description</label>
                <textarea id={`section-description-${index}`} name="description" value={section.description} onChange={(e) => handleSectionChange(index, e)} />
              </div>
              {/* Content management for each section */}
              <div>
                <h5>Section Content</h5>
                {(section.content || []).length === 0 && <p>No content has been added to this section.</p>}

                {(section.content || []).map((contentItem, contentIndex) => (
                  <div key={contentItem._id || `content-${index}-${contentIndex}`}>
                    <h6>Content {contentIndex + 1}</h6>
                    <button type="button" onClick={() => handleMoveContent(index, contentIndex, -1)} disabled={contentIndex === 0}>
                      ↑
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => handleMoveContent(index, contentIndex, 1)}
                      disabled={contentIndex === (section.content || []).length - 1}>
                      ↓
                    </button>{" "}
                    <button type="button" onClick={() => handleRemoveContent(index, contentIndex)}>
                      Remove Content
                    </button>
                    <div>
                      <label htmlFor={`content-title-${index}-${contentIndex}`}>Title</label>
                      <input
                        type="text"
                        id={`content-title-${index}-${contentIndex}`}
                        name="title"
                        value={contentItem.title}
                        onChange={(e) => handleContentChange(index, contentIndex, e)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`content-description-${index}-${contentIndex}`}>Description</label>
                      <textarea
                        id={`content-description-${index}-${contentIndex}`}
                        name="description"
                        value={contentItem.description}
                        onChange={(e) => handleContentChange(index, contentIndex, e)}
                      />
                    </div>
                    {/* Content type selection and file upload handling */}
                    <div>
                      <label htmlFor={`content-type-${index}-${contentIndex}`}>Content Type</label>
                      <select
                        id={`content-type-${index}-${contentIndex}`}
                        name="type"
                        value={contentItem.type}
                        onChange={(e) => handleContentChange(index, contentIndex, e)}
                        required>
                        <option value="">Select Content Type</option>
                        <option value="document">Document</option>
                        <option value="video">Video</option>
                        <option value="presentation">Presentation</option>
                        <option value="recording">Recording</option>
                        <option value="link">Link</option>
                      </select>
                    </div>
                    {contentItem.type === "link" && (
                      <div>
                        <label htmlFor={`content-url-${index}-${contentIndex}`}>Resource URL</label>
                        <input
                          type="text"
                          id={`content-url-${index}-${contentIndex}`}
                          name="resourceUrl"
                          value={contentItem.resourceUrl}
                          onChange={(e) => handleContentChange(index, contentIndex, e)}
                          placeholder="www.example.com"
                          required
                        />
                      </div>
                    )}
                    {["document", "video", "presentation", "recording"].includes(contentItem.type) && (
                      <div>
                        <label htmlFor={`content-file-${index}-${contentIndex}`}>Upload File</label>
                        <input
                          type="file"
                          id={`content-file-${index}-${contentIndex}`}
                          accept={getAcceptedFileTypes(contentItem.type)}
                          onChange={(e) => handleFileUpload(index, contentIndex, e.target.files[0], contentItem.type)}
                          disabled={uploadingContent === `${index}-${contentIndex}`}
                        />
                        {uploadingContent === `${index}-${contentIndex}` && <p>Uploading...</p>}
                      </div>
                    )}
                    {contentItem.fileName && (
                      <p>
                        <strong>File:</strong> {contentItem.fileName}
                      </p>
                    )}
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          name="isRequired"
                          checked={contentItem.isRequired}
                          onChange={(e) => handleContentChange(index, contentIndex, e)}
                        />
                        Required Content
                      </label>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddContent(index)}>
                  + Add Content
                </button>
              </div>
            </div>
          ))}
          <hr />
          <button type="button" onClick={handleAddSection}>
            + Add Section
          </button>
        </section>
        <div>
          <br />
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p>{error}</p>}
          {isArchivedForFaculty && <p style={{ color: "red" }}>This course is archived and cannot be edited.</p>}
          <button type="submit" disabled={isArchivedForFaculty}>
            Save Updates
          </button>
          {" | "}
          <button type="button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </form>
    </main>
  );
}

export default CourseEditor;
