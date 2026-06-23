const express = require("express");
const router = express.Router();

const submissionController = require("../controllers/submission.controller");
const { protect } = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate.middleware");
const { submitQuizValidator } = require("../validators/submission.validator");

router.post("/", asyncHandler(protect), submitQuizValidator, validate, asyncHandler(submissionController.submitQuiz));

// Lịch sử làm bài của user đang đăng nhập
router.get("/history", asyncHandler(protect), asyncHandler(submissionController.getUserSubmissions));

// Chi tiết bài nộp
router.get("/:id", asyncHandler(protect), asyncHandler(submissionController.getSubmissionById));

module.exports = router;
