const Enrollment = require("../models/enrollmentModel");

const createEnrollment = async (enrollmentData) => {
  return await Enrollment.create(enrollmentData);
};

// Find the enrollment relationship between one student and one course
const findEnrollmentByStudentAndCourse = async (userid, id) => {
  return await Enrollment.findOne({
    student: userid,
    course: id,
  });
};

// Find one enrollment by its MongoDB _id
const findEnrollmentById = async (id) => {
  return await Enrollment.findById(id);
};

// Get all enrollments belonging to one student
const findEnrollmentsByStudent = async (userId) => {
  return await Enrollment.find({ student: userId })
    .populate("course", "courseId title category status durationWeeks faculty sections.content._id sections.content.isRequired")
    .sort({ requestedAt: -1 });
};

// Get enrollments for a group of courses
const findEnrollmentsByCourseIds = async (ids) => {
  return await Enrollment.find({
    course: { $in: ids },
  })
    .populate("student", "firstName lastName email studentProfile.studentId")
    .populate("course", "courseId title category status durationWeeks faculty sections.content._id sections.content.isRequired")
    .sort({ requestedAt: -1 });
};

// Update any enrollment fields
const updateEnrollmentById = async (id, updatedData) => {
  return await Enrollment.findByIdAndUpdate(id, updatedData, {
    returnDocument: "after",
    runValidators: true,
  });
};

module.exports = {
  createEnrollment,
  findEnrollmentByStudentAndCourse,
  findEnrollmentById,
  findEnrollmentsByStudent,
  findEnrollmentsByCourseIds,
  updateEnrollmentById,
};
