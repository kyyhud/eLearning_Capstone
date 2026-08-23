const Counter = require("../models/counterModel");

const getNextId = async (name, initialValue) => {
  let counter = await Counter.findOne({ name });

  if (!counter) {
    counter = await Counter.create({
      name,
      value: initialValue,
    });
    return counter.value;
  }

  counter.value += 1;
  await counter.save();

  return counter.value;
};

const getNextCourseId = async (level) => {
  const courseLevel = Number(level);
  if (![100, 200, 300, 400].includes(courseLevel)) {
    throw new Error("Invalid course level");
  }
  const counter = await Counter.findOneAndUpdate(
    { name: `courseId-${courseLevel}` },
    { $inc: { value: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
  if (counter.value > 99) {
    throw new Error(`No available course IDs remaining in the ${courseLevel} level`);
  }
  return courseLevel + counter.value;
};

module.exports = { getNextId, getNextCourseId };
