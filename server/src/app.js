const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const app = express();

connectDB();

app.use(express.json());
// htttp://localhost:3000/api/users/*
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
