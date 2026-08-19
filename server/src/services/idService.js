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

module.exports = { getNextId };
