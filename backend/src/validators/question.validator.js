const { body } = require("express-validator");

const questionValidator = [
  body("content")
    .trim().notEmpty().withMessage("Nội dung câu hỏi không được để trống")
    .isLength({ max: 5000 }).withMessage("Nội dung câu hỏi quá dài"),
  body("type")
    .isIn(["multiple_choice", "short_answer"]).withMessage("Loại câu hỏi không hợp lệ"),
  body("options")
    .optional().isArray({ max: 10 }).withMessage("Danh sách lựa chọn không hợp lệ")
    .custom((options, { req }) => {
      if (req.body.type === "multiple_choice" && options.length < 2) {
        throw new Error("Câu trắc nghiệm phải có ít nhất 2 lựa chọn");
      }
      return true;
    }),
  body("options.*")
    .optional().isString().withMessage("Mỗi lựa chọn phải là chuỗi")
    .trim().notEmpty().withMessage("Lựa chọn không được để trống")
    .isLength({ max: 1000 }).withMessage("Lựa chọn quá dài"),
  body("difficulty")
    .optional().isIn(["Easy", "Medium", "Hard"]).withMessage("Độ khó không hợp lệ"),
  body("correctAnswer")
    .trim().notEmpty().withMessage("Đáp án đúng không được để trống")
    .isLength({ max: 5000 }).withMessage("Đáp án quá dài"),
  body("tags")
    .isArray({ min: 1, max: 20 }).withMessage("Câu hỏi phải có từ 1 đến 20 tag"),
  body("tags.*")
    .isString().withMessage("Tag phải là chuỗi")
    .trim().notEmpty().withMessage("Tag không được để trống")
    .isLength({ max: 50 }).withMessage("Tag không được vượt quá 50 ký tự"),
  body("explanation")
    .optional().isString().withMessage("Giải thích phải là chuỗi")
    .trim().isLength({ max: 10000 }).withMessage("Giải thích quá dài"),
  body("status")
    .optional().isIn(["draft", "published", "archived"]).withMessage("Trạng thái không hợp lệ"),
];

module.exports = { questionValidator };
