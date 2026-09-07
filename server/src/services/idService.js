const counterRepository = require("../repositories/counterRepository");

const getNextId = async (name, initialValue) => {
  const counter = await counterRepository.getNextCounterValue(name, initialValue);
  return counter.value;
};

const getNextCourseId = async (level) => {
  const courseLevel = Number(level);
  if (![100, 200, 300, 400].includes(courseLevel)) {
    throw new Error("Invalid course level");
  }
  const counter = await counterRepository.getNextCounterValue(`courseId-${courseLevel}`, 1);
  if (counter.value > 99) {
    throw new Error(`No available course IDs remaining in the ${courseLevel} level`);
  }
  return courseLevel + counter.value;
};

module.exports = { getNextId, getNextCourseId };
