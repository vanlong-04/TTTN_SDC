const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Submission = require("../models/Submission");
const AppError = require("../utils/AppError");

const { compareAnswer } = require("../utils/compareAnswer");

/**
 * Nộp bài và tự động chấm câu trắc nghiệm
 */
const submitQuiz = async (data) => {
  const { user_id, quiz_id, answers } = data;

  if (!user_id || !quiz_id || !Array.isArray(answers)) {
    throw new AppError("Thiếu user_id, quiz_id hoặc answers không hợp lệ", 400);
  }

  const quiz = await Quiz.findById(quiz_id);

  if (!quiz) {
    throw new AppError("Không tìm thấy đề thi", 404);
  }

  const quizQuestionIds = quiz.questions.map((id) => id.toString());

  const questions = await Question.find({
    _id: {
      $in: quizQuestionIds,
    },
  });

  const userAnswerMap = {};

  answers.forEach((answer) => {
    userAnswerMap[answer.question_id] = answer.userAnswer;
  });

  let totalScore = 0;
  let maxScore = 0;
  let hasShortAnswer = false;

  const checkedAnswers = questions.map((question) => {
    const questionId = question._id.toString();
    const userAnswer = userAnswerMap[questionId] || "";

    let isCorrect = false;
    let score = 0;

    if (question.type === "multiple_choice") {
      maxScore += 1;

      isCorrect = compareAnswer(userAnswer, question.correctAnswer);

      if (isCorrect) {
        score = 1;
        totalScore += 1;
      }
    }

    if (question.type === "short_answer") {
      hasShortAnswer = true;
    }

    return {
      question: question._id,
      userAnswer,
      isCorrect,
      score,
    };
  });

  const submission = await Submission.create({
    user: user_id,
    quiz: quiz_id,
    answers: checkedAnswers,
    totalScore,
    maxScore,
    status: hasShortAnswer ? "pending_review" : "auto_graded",
    submittedAt: new Date(),
  });

  return {
    submission_id: submission._id,
    totalScore,
    maxScore,
    totalQuestions: questions.length,
    status: submission.status,
    checkedAnswers,
  };
};

/**
 * Lấy lịch sử làm bài của user đang đăng nhập
 */
const getUserSubmissions = async (userId) => {
  return await Submission.find({ user: userId })
    .populate("quiz", "title duration tags difficulty questionCount")
    .sort({ createdAt: -1 });
};

/**
 * Lấy chi tiết một bài nộp
 */
const getSubmissionById = async (id, user) => {
  const submission = await Submission.findById(id)
    .populate("user", "username email role")
    .populate("quiz", "title description duration tags difficulty")
    .populate("answers.question");

  if (!submission) {
    return null;
  }

  /**
   * User thường chỉ được xem bài của chính mình.
   * Admin được xem tất cả.
   */
  const isOwner = submission.user._id.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Bạn không có quyền xem bài nộp này", 403);
  }

  return submission;
};

module.exports = {
  submitQuiz,
  getUserSubmissions,
  getSubmissionById,
};
