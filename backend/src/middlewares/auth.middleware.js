const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
  }

  let decoded;

  try {
    decoded = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
  } catch {
    return next(new AppError("Token không hợp lệ hoặc đã hết hạn", 401));
  }

  const user = await User.findById(decoded.userId);

  if (!user) return next(new AppError("Người dùng không còn tồn tại", 401));

  req.user = user;
  return next();
};

module.exports = protect;
module.exports.protect = protect;
