const AppError = require("../utils/AppError");

const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("Bạn không có quyền thực hiện thao tác này", 403));
  }

  return next();
};

module.exports = allowRoles;
