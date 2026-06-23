const User = require("../models/User");
const AppError = require("../utils/AppError");
const generateToken = require("../utils/generateToken");

const serializeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

exports.register = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new AppError("Vui lòng nhập đầy đủ username, email và password", 400);
  }

  const normalizedEmail = email.toString().trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) throw new AppError("Email đã được sử dụng", 409);

  const user = await User.create({
    username: username.toString().trim(),
    email: normalizedEmail,
    password,
    role: "user",
  });

  return { user: serializeUser(user), token: generateToken(user._id) };
};

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Vui lòng nhập email và password", 400);
  }

  const user = await User.findOne({
    email: email.toString().trim().toLowerCase(),
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Email hoặc mật khẩu không chính xác", 401);
  }

  return { user: serializeUser(user), token: generateToken(user._id) };
};

exports.getProfile = (user) => serializeUser(user);
