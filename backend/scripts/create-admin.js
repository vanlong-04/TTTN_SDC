const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../src/config/db");
const User = require("../src/models/User");

const createAdmin = async () => {
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Thiếu ADMIN_USERNAME, ADMIN_EMAIL hoặc ADMIN_PASSWORD trong .env"
    );
  }

  await connectDB();
  const normalizedEmail = ADMIN_EMAIL.toLowerCase().trim();
  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    user.username = ADMIN_USERNAME;
    user.role = "admin";
    user.password = ADMIN_PASSWORD;
    await user.save();
  } else {
    user = await User.create({
      username: ADMIN_USERNAME,
      email: normalizedEmail,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
  }

  console.log(`Đã tạo/cập nhật admin: ${user.email}`);
};

createAdmin()
  .catch((error) => {
    console.error("Không thể tạo admin:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
