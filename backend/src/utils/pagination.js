const AppError = require("./AppError");

const parsePagination = (pageValue = 1, limitValue = 10) => {
  const page = Number.parseInt(pageValue, 10);
  const limit = Number.parseInt(limitValue, 10);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("Page phải là số nguyên lớn hơn hoặc bằng 1", 400);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("Limit phải là số nguyên từ 1 đến 100", 400);
  }

  return { page, limit, skip: (page - 1) * limit };
};

module.exports = parsePagination;
