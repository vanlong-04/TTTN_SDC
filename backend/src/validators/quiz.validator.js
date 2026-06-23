const { body } = require("express-validator");

const sharedQuizFields = [
  body("title")
    .trim().notEmpty().withMessage("Tên đề thi không được để trống")
    .isLength({ max: 200 }).withMessage("Tên đề thi không được vượt quá 200 ký tự"),
  body("description")
    .optional().isString().withMessage("Mô tả phải là chuỗi")
    .trim().isLength({ max: 5000 }).withMessage("Mô tả quá dài"),
  body("duration")
    .isInt({ min: 1, max: 240 }).withMessage("Thời gian phải là số nguyên từ 1 đến 240 phút")
    .toInt(),
  body("questions")
    .isArray({ min: 1, max: 100 }).withMessage("Đề thi phải có từ 1 đến 100 câu hỏi"),
  body("questions.*").isMongoId().withMessage("ID câu hỏi không hợp lệ"),
  body("tags").optional().isArray({ max: 20 }).withMessage("Danh sách tag không hợp lệ"),
  body("tags.*")
    .optional().isString().withMessage("Tag phải là chuỗi")
    .trim().notEmpty().withMessage("Tag không được để trống")
    .isLength({ max: 50 }).withMessage("Tag không được vượt quá 50 ký tự"),
  body("difficulty")
    .optional().isIn(["Easy", "Medium", "Hard", "Mixed"]).withMessage("Độ khó không hợp lệ"),
  body("status")
    .optional().isIn(["draft", "published", "archived"]).withMessage("Trạng thái không hợp lệ"),
];

const generateQuizValidator = [
  body("tag")
    .trim().notEmpty().withMessage("Vui lòng chọn tag công nghệ")
    .isLength({ max: 50 }).withMessage("Tag không được vượt quá 50 ký tự"),
  body("title").optional().isString().trim().isLength({ max: 200 }).withMessage("Tên đề thi quá dài"),
  body("description").optional().isString().trim().isLength({ max: 5000 }).withMessage("Mô tả quá dài"),
  body("questionCount")
    .isInt({ min: 1, max: 50 }).withMessage("Số câu hỏi phải là số nguyên từ 1 đến 50")
    .toInt(),
  body("duration")
    .isInt({ min: 1, max: 240 }).withMessage("Thời gian phải là số nguyên từ 1 đến 240 phút")
    .toInt(),
  body("difficulty")
    .optional().isIn(["Easy", "Medium", "Hard", "Mixed"]).withMessage("Độ khó không hợp lệ"),
];

module.exports = { createQuizValidator: sharedQuizFields, generateQuizValidator };
