const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce";

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
