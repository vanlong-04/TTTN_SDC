const express = require("express");
const router = express.Router();

const questionController = require("../controllers/question.controller");
const protect = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate.middleware");
const { questionValidator } = require("../validators/question.validator");

// Candidate xem ngân hàng câu hỏi published
router.get("/bank", asyncHandler(questionController.getQuestionBank));

// Chỉ admin xem toàn bộ câu hỏi, bao gồm draft và archived
router.get(
  "/",
  asyncHandler(protect),
  allowRoles("admin"),
  asyncHandler(questionController.getQuestions)
);

// Chỉ admin xem chi tiết câu hỏi quản trị
router.get(
  "/:id",
  asyncHandler(protect),
  allowRoles("admin"),
  asyncHandler(questionController.getQuestionById)
);

// Chỉ admin được thêm/sửa/xóa câu hỏi
router.post(
  "/",
  protect,
  allowRoles("admin"),
  questionValidator,
  validate,
  asyncHandler(questionController.createQuestion)
);

router.put(
  "/:id",
  protect,
  allowRoles("admin"),
  questionValidator,
  validate,
  asyncHandler(questionController.updateQuestion)
);

router.delete(
  "/:id",
  protect,
  allowRoles("admin"),
  asyncHandler(questionController.deleteQuestion)
);

module.exports = router;
