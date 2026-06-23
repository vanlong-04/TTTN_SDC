const express = require("express");
const quizController = require("../controllers/quiz.controller");
const protect = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate.middleware");
const { createQuizValidator, generateQuizValidator } = require("../validators/quiz.validator");

const router = express.Router();

router.use(asyncHandler(protect));
// Hai route public phải đứng trước /:id để "public" không bị hiểu là một ID.
router.get("/public", asyncHandler(quizController.getPublishedQuizzes));
router.get("/public/:id", asyncHandler(quizController.getPublishedQuizById));
router.post("/generate", generateQuizValidator, validate, asyncHandler(quizController.generateQuiz));
router.get("/", asyncHandler(quizController.getQuizzes));
router.post("/", allowRoles("admin"), createQuizValidator, validate, asyncHandler(quizController.createQuiz));
router.get("/:id", asyncHandler(quizController.getQuizById));
router.put("/:id", allowRoles("admin"), createQuizValidator, validate, asyncHandler(quizController.updateQuiz));
router.delete("/:id", allowRoles("admin"), asyncHandler(quizController.deleteQuiz));

module.exports = router;
