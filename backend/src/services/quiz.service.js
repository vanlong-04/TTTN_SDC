const mongoose = require("mongoose");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const AppError = require("../utils/AppError");
const parsePagination = require("../utils/pagination");

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Mixed"];
const STATUSES = ["draft", "published", "archived"];
const EDITABLE_FIELDS = [
  "title",
  "description",
  "questions",
  "duration",
  "tags",
  "difficulty",
  "status",
];

const assertObjectId = (id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new AppError("ID đề thi không đúng định dạng", 400);
  }
};

const parsePositiveNumber = (value, field, { integer = false, max } = {}) => {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < 1 ||
    (integer && !Number.isInteger(number)) ||
    (max && number > max)
  ) {
    throw new AppError(
      `${field} phải là ${integer ? "số nguyên " : ""}từ 1${max ? ` đến ${max}` : ""}`,
      400
    );
  }

  return number;
};

const validateQuestionIds = async (questionIds) => {
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    throw new AppError("Danh sách câu hỏi không được để trống", 400);
  }

  const ids = [...new Set(questionIds.map(String))];

  if (ids.length !== questionIds.length || ids.some((id) => !mongoose.isObjectIdOrHexString(id))) {
    throw new AppError("Danh sách câu hỏi chứa ID không hợp lệ hoặc bị trùng", 400);
  }

  const existingCount = await Question.countDocuments({ _id: { $in: ids } });
  if (existingCount !== ids.length) {
    throw new AppError("Một hoặc nhiều câu hỏi không tồn tại", 400);
  }

  return ids;
};

const toPublicQuestions = (questions) =>
  questions.map(({ correctAnswer, explanation, ...question }) => question);

/**
 * Candidate chỉ được xem các đề đã xuất bản. Danh sách không populate câu hỏi
 * để tránh vừa tải dữ liệu thừa vừa vô tình làm lộ đáp án.
 */
exports.getPublishedQuizzes = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query.page, query.limit ?? 9);
  const filter = { status: "published" };

  if (query.difficulty && !DIFFICULTIES.includes(query.difficulty)) {
    throw new AppError("Độ khó không hợp lệ", 400);
  }

  if (query.tag) filter.tags = query.tag.trim();
  if (query.difficulty && query.difficulty !== "Mixed") {
    filter.difficulty = query.difficulty;
  }

  const [quizzes, total] = await Promise.all([
    Quiz.find(filter)
      .select("title description duration tags difficulty questionCount status createdAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Quiz.countDocuments(filter),
  ]);

  return {
    quizzes,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalQuizzes: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Dữ liệu phòng thi tuyệt đối không chứa correctAnswer hoặc explanation.
 */
exports.getPublishedQuizById = async (id) => {
  assertObjectId(id);

  const quiz = await Quiz.findOne({ _id: id, status: "published" })
    .select("title description duration tags difficulty questionCount status questions")
    .populate({
      path: "questions",
      select: "content type options difficulty tags",
      match: { status: "published" },
    });

  if (!quiz) {
    throw new AppError("Không tìm thấy đề thi hoặc đề chưa được xuất bản", 404);
  }

  return {
    quiz: {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      tags: quiz.tags,
      difficulty: quiz.difficulty,
      questionCount: quiz.questions.length,
      status: quiz.status,
    },
    questions: quiz.questions,
  };
};

exports.generateQuiz = async (data, userId = null) => {
  const tag = typeof data.tag === "string" ? data.tag.trim() : "";
  const difficulty = data.difficulty || "Mixed";
  const duration = parsePositiveNumber(data.duration ?? 30, "Thời gian");
  const questionCount = parsePositiveNumber(
    data.questionCount ?? 10,
    "Số câu hỏi",
    { integer: true, max: 50 }
  );

  if (!tag) throw new AppError("Vui lòng chọn tag công nghệ", 400);
  if (!DIFFICULTIES.includes(difficulty)) {
    throw new AppError("Độ khó không hợp lệ", 400);
  }

  const match = {
    tags: tag,
    $or: [{ status: "published" }, { status: { $exists: false } }],
  };
  if (difficulty !== "Mixed") match.difficulty = difficulty;

  const randomQuestions = await Question.aggregate([
    { $match: match },
    { $sample: { size: questionCount } },
  ]);

  if (randomQuestions.length < questionCount) {
    throw new AppError(
      `Không đủ ${questionCount} câu hỏi cho tag ${tag}. Hiện chỉ có ${randomQuestions.length} câu phù hợp.`,
      400,
      { totalFound: randomQuestions.length }
    );
  }

  const quiz = await Quiz.create({
    title:
      typeof data.title === "string" && data.title.trim()
        ? data.title.trim()
        : `Mock Test ${tag}`,
    description: data.description || "",
    questions: randomQuestions.map((question) => question._id),
    duration,
    tags: [tag],
    difficulty,
    questionCount,
    status: "published",
    createdBy: userId,
  });

  return { quiz, questions: toPublicQuestions(randomQuestions) };
};

exports.createQuiz = async (data, userId = null) => {
  if (!data.title?.trim() || data.duration == null) {
    throw new AppError("Tên đề, thời gian và danh sách câu hỏi là bắt buộc", 400);
  }

  const questions = await validateQuestionIds(data.questions);

  return Quiz.create({
    title: data.title.trim(),
    description: data.description || "",
    questions,
    duration: parsePositiveNumber(data.duration, "Thời gian"),
    tags: Array.isArray(data.tags) ? data.tags : [],
    difficulty: data.difficulty || "Mixed",
    status: data.status || "published",
    createdBy: userId,
  });
};

exports.getQuizzes = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query.page, query.limit);
  const filter = {};

  if (query.difficulty && !DIFFICULTIES.includes(query.difficulty)) {
    throw new AppError("Độ khó không hợp lệ", 400);
  }
  if (query.status && !STATUSES.includes(query.status)) {
    throw new AppError("Trạng thái đề thi không hợp lệ", 400);
  }

  if (query.tag) filter.tags = query.tag;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.status) filter.status = query.status;

  const [quizzes, total] = await Promise.all([
    Quiz.find(filter)
      .populate("questions", "content type difficulty tags status")
      .populate("createdBy", "username email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Quiz.countDocuments(filter),
  ]);

  return {
    quizzes,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalQuizzes: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getQuizById = async (id) => {
  assertObjectId(id);
  const quiz = await Quiz.findById(id)
    .populate("questions", "-correctAnswer -explanation")
    .populate("createdBy", "username email");

  if (!quiz) throw new AppError("Không tìm thấy đề thi", 404);
  return quiz;
};

exports.updateQuiz = async (id, data) => {
  assertObjectId(id);
  const quiz = await Quiz.findById(id);

  if (!quiz) throw new AppError("Không tìm thấy đề thi để cập nhật", 404);

  const updates = Object.fromEntries(
    EDITABLE_FIELDS.filter((field) => data[field] !== undefined).map((field) => [
      field,
      data[field],
    ])
  );

  if (updates.questions) updates.questions = await validateQuestionIds(updates.questions);
  if (updates.duration !== undefined) {
    updates.duration = parsePositiveNumber(updates.duration, "Thời gian");
  }

  Object.assign(quiz, updates);
  await quiz.save();
  return quiz.populate("questions", "content type difficulty tags status");
};

exports.deleteQuiz = async (id) => {
  assertObjectId(id);
  const quiz = await Quiz.findByIdAndDelete(id);

  if (!quiz) throw new AppError("Không tìm thấy đề thi để xóa", 404);
  return quiz;
};
