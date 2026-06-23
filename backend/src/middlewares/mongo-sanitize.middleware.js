const mongoSanitize = require("express-mongo-sanitize");
const AppError = require("../utils/AppError");

// express-mongo-sanitize gán lại req.query, không tương thích getter của Express 5.
// Sanitize trực tiếp từng object vẫn dùng đúng engine của package và tránh lỗi đó.
const sanitizeRequest = (req, res, next) => {
  if (req.query && mongoSanitize.has(req.query)) {
    return next(new AppError("Query chứa toán tử không được phép", 400));
  }
  if (req.query && Object.values(req.query).some(Array.isArray)) {
    return next(new AppError("Mỗi query parameter chỉ được xuất hiện một lần", 400));
  }

  if (req.body && typeof req.body === "object") mongoSanitize.sanitize(req.body);
  return next();
};

module.exports = sanitizeRequest;
