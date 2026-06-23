const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
  next(new AppError(`Không tìm thấy API ${req.method} ${req.originalUrl}`, 404));
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Lỗi máy chủ nội bộ";
  let details = error.details;

  if (error.type === "entity.too.large") {
    statusCode = 413;
    message = "Dữ liệu gửi lên quá lớn";
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Dữ liệu không hợp lệ";
    details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "ID không đúng định dạng";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "Dữ liệu đã tồn tại";
  }

  if (statusCode >= 500) console.error(error);

  const payload = { success: false, message };
  if (details !== undefined) payload.details = details;
  if (process.env.NODE_ENV !== "production") payload.stack = error.stack;

  res.status(statusCode).json(payload);
};

module.exports = { notFound, errorHandler };
