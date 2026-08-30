const Enrollment = require("../models/enrollmentModel");

const createEnrollment = async (enrollmentData) => {
  return await Enrollment.create(enrollmentData);
};

// Find the enrollment relationship between one student and one course
const findEnrollmentByStudentAndCourse = async (studentId, courseId) => {
  return await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });
};

// Find one enrollment by its MongoDB _id
const findEnrollmentById = async (id) => {
  return await Enrollment.findById(id);
};

// Get all enrollments belonging to one student
const findEnrollmentsByStudent = async (studentId) => {
  return await Enrollment.find({ student: studentId }).populate("course", "courseId title category status durationWeeks faculty").sort({ requestedAt: -1 });
};

// Get enrollments for a group of courses
const findEnrollmentsByCourseIds = async (courseIds) => {
  return await Enrollment.find({
    course: { $in: courseIds },
  })
    .populate("student", "firstName lastName email studentProfile.studentId")
    .populate("course", "courseId title status faculty")
    .sort({ requestedAt: -1 });
};

// Update any enrollment fields
const updateEnrollmentById = async (id, updatedData) => {
  return await Enrollment.findByIdAndUpdate(id, updatedData, {
    new: true,
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
