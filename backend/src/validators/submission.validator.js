const { body } = require("express-validator");

const submitQuizValidator = [
  body("quiz_id").isMongoId().withMessage("ID đề thi không hợp lệ"),
  body("answers").isArray({ min: 1, max: 100 }).withMessage("Danh sách câu trả lời không hợp lệ"),
  body("answers.*.question_id").isMongoId().withMessage("ID câu hỏi không hợp lệ"),
  body("answers.*.userAnswer")
    .optional({ values: "null" }).isString().withMessage("Câu trả lời phải là chuỗi")
    .isLength({ max: 10000 }).withMessage("Câu trả lời quá dài"),
];

module.exports = { submitQuizValidator };
