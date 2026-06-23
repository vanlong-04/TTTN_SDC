const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: "Đăng ký thành công",
    data: result,
  });
};

exports.login = async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json({
    success: true,
    message: "Đăng nhập thành công",
    data: result,
  });
};

exports.getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: authService.getProfile(req.user),
  });
};
