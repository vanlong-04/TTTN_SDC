const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const details = result.array({ onlyFirstError: true }).map((error) => ({
      field: error.path,
      message: error.msg,
    }));
    return next(new AppError("Dữ liệu không hợp lệ", 400, details));
  }

  return next();
};

module.exports = validate;
