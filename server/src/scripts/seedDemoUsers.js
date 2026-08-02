require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const seedDemoUsers = async () => {
  try {
    // Connect directly because this script does not start the Express server.
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }
    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB");

    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    // Fail clearly if the required environment variables are missing.
    if (!adminEmail || !adminPassword) {
      throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be defined in .env");
    }

    // Prevent duplicate administrators when the script is run again.
    const existingAdmin = await User.findOne({
      email: adminEmail.toLowerCase(),
    });

    if (existingAdmin) {
      console.log(`Admin user already exists: ${adminEmail}`);
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const adminUser = await User.create({
      email: adminEmail.toLowerCase(),
      passwordHash,
      typeOfUser: "admin",
    });

    console.log(`Admin user created: ${adminUser.email}`);
  } catch (error) {
    console.error("Unable to seed users:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedDemoUsers();
