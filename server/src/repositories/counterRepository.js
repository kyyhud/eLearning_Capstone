const Counter = require("../models/counterModel");

const getNextCounterValue = async (name, initialValue) => {
  return await Counter.findOneAndUpdate(
    { name },
    [
      {
        $set: {
          name,
          value: {
            $ifNull: [
              {
                $add: ["$value", 1],
              },
              initialValue,
            ],
          },
        },
      },
    ],
    {
      returnDocument: "after",
      upsert: true,
      updatePipeline: true,
    },
  );
};

module.exports = {
  getNextCounterValue,
};
