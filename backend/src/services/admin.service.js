const mongoose = require("mongoose");
const User = require("../models/User");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const Submission = require("../models/Submission");
const AppError = require("../utils/AppError");

const VALID_STATUSES = ["auto_graded", "pending_review", "reviewed"];

const assertObjectId = (id, message = "ID bài nộp không đúng định dạng") => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new AppError(message, 400);
  }
};

const normalizePagination = ({ page = 1, limit = 10 }) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 50);

  return {
    currentPage,
    pageSize,
    skip: (currentPage - 1) * pageSize,
  };
};

exports.getDashboardStats = async () => {
  const [
    totalUsers,
    totalQuestions,
    totalQuizzes,
    totalSubmissions,
    pendingReviewSubmissions,
    reviewedSubmissions,
    autoGradedSubmissions,
    scoreStats,
    recentSubmissions,
  ] = await Promise.all([
    User.countDocuments(),
    Question.countDocuments(),
    Quiz.countDocuments(),
    Submission.countDocuments(),
    Submission.countDocuments({ status: "pending_review" }),
    Submission.countDocuments({ status: "reviewed" }),
    Submission.countDocuments({ status: "auto_graded" }),
    Submission.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$totalScore" },
          highestScore: { $max: "$totalScore" },
          lowestScore: { $min: "$totalScore" },
        },
      },
    ]),
    Submission.find()
      .populate("user", "username email")
      .populate("quiz", "title tags duration difficulty")
      .sort({ submittedAt: -1, createdAt: -1 })
      .limit(6),
  ]);

  return {
    overview: {
      totalUsers,
      totalQuestions,
      totalQuizzes,
      totalSubmissions,
      pendingReviewSubmissions,
      reviewedSubmissions,
      autoGradedSubmissions,
    },
    scoreStats: scoreStats[0] || {
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
    },
    recentSubmissions,
  };
};

exports.getAdminSubmissions = async (query = {}) => {
  const { status } = query;
  const filter = {};

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new AppError("Trạng thái bài nộp không hợp lệ", 400);
    }

    filter.status = status;
  }

  const { currentPage, pageSize, skip } = normalizePagination(query);

  const [submissions, totalSubmissions] = await Promise.all([
    Submission.find(filter)
      .populate("user", "username email")
      .populate("quiz", "title tags duration difficulty")
      .sort({ submittedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Submission.countDocuments(filter),
  ]);

  return {
    submissions,
    pagination: {
      currentPage,
      pageSize,
      totalSubmissions,
      totalPages: Math.ceil(totalSubmissions / pageSize),
    },
  };
};

exports.getAdminSubmissionById = async (id) => {
  assertObjectId(id);

  const submission = await Submission.findById(id)
    .populate("user", "username email role")
    .populate("quiz", "title description duration tags difficulty questionCount")
    .populate(
      "answers.question",
      "content type options correctAnswer explanation difficulty tags"
    );

  if (!submission) throw new AppError("Không tìm thấy bài nộp", 404);

  return submission;
};

exports.reviewSubmission = async (submissionId, data = {}) => {
  assertObjectId(submissionId);

  const { reviews } = data;
  if (!Array.isArray(reviews)) {
    throw new AppError("Dữ liệu reviews không hợp lệ", 400);
  }

  const invalidReview = reviews.some(
    (review) =>
      !review ||
      !mongoose.isObjectIdOrHexString(review.question_id) ||
      Number.isNaN(Number(review.manualScore))
  );

  if (invalidReview) {
    throw new AppError("Dữ liệu chấm tự luận không đúng định dạng", 400);
  }

  const submission = await Submission.findById(submissionId).populate(
    "answers.question",
    "type"
  );

  if (!submission) throw new AppError("Không tìm thấy bài nộp", 404);

  const reviewMap = new Map(
    reviews.map((review) => [
      review.question_id.toString(),
      {
        manualScore: Math.min(Math.max(Number(review.manualScore), 0), 1),
        reviewerComment: review.reviewerComment?.toString() || "",
      },
    ])
  );

  let totalScore = 0;
  let maxScore = 0;
  let shortAnswerCount = 0;

  submission.answers.forEach((answer) => {
    const question = answer.question;
    if (!question) return;

    maxScore += 1;

    if (question.type === "short_answer") {
      shortAnswerCount += 1;
      const review = reviewMap.get(question._id.toString());

      if (review) {
        answer.manualScore = review.manualScore;
        answer.score = review.manualScore;
        answer.reviewerComment = review.reviewerComment;
      }
    }

    totalScore += Number(answer.score) || 0;
  });

  if (shortAnswerCount === 0) {
    throw new AppError("Bài nộp này không có câu tự luận cần chấm", 400);
  }

  submission.totalScore = totalScore;
  submission.maxScore = maxScore;
  submission.status = "reviewed";

  await submission.save();

  return exports.getAdminSubmissionById(submissionId);
};
