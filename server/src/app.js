require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const app = express();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

// http://localhost:3000/api/users/*
app.use("/api/users", userRoutes);

// http://localhost:3000/api/courses/*
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
