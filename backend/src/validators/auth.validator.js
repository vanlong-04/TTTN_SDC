const { body } = require("express-validator");

const registerValidator = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username không được để trống")
    .isLength({ min: 3, max: 50 }).withMessage("Username phải có từ 3 đến 50 ký tự"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password")
    .isString().withMessage("Password không hợp lệ")
    .isLength({ min: 6, max: 128 }).withMessage("Password phải có từ 6 đến 128 ký tự"),
  body("role")
    .not().exists().withMessage("Không được tự chỉ định quyền tài khoản"),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password")
    .isString().withMessage("Password không hợp lệ")
    .notEmpty().withMessage("Password không được để trống")
    .isLength({ max: 128 }).withMessage("Password không được vượt quá 128 ký tự"),
];

module.exports = { registerValidator, loginValidator };
