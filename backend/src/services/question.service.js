const Question = require("../models/Question");
const AppError = require("../utils/AppError");
const parsePagination = require("../utils/pagination");

const TYPES = ["multiple_choice", "short_answer"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const STATUSES = ["draft", "published", "archived"];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildFilter = (query, { publishedOnly = false, allowSearch = false } = {}) => {
  const filter = publishedOnly ? { status: "published" } : {};

  if (query.type && !TYPES.includes(query.type)) throw new AppError("Loại câu hỏi không hợp lệ", 400);
  if (query.difficulty && !DIFFICULTIES.includes(query.difficulty)) throw new AppError("Độ khó không hợp lệ", 400);
  if (!publishedOnly && query.status && !STATUSES.includes(query.status)) throw new AppError("Trạng thái không hợp lệ", 400);

  if (query.tag) filter.tags = query.tag.toString().trim();
  if (query.type) filter.type = query.type;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (!publishedOnly && query.status) filter.status = query.status;

  if (allowSearch && query.search) {
    const search = query.search.toString().trim();
    if (search.length > 100) throw new AppError("Từ khóa tìm kiếm quá dài", 400);
    filter.content = { $regex: escapeRegex(search), $options: "i" };
  }

  return filter;
};

const findPaginated = async (filter, query, defaultLimit) => {
  const { page, limit, skip } = parsePagination(query.page, query.limit ?? defaultLimit);
  const [questions, totalQuestions] = await Promise.all([
    Question.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Question.countDocuments(filter),
  ]);

  return {
    questions,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalQuestions,
      totalPages: Math.ceil(totalQuestions / limit),
    },
  };
};

const getQuestions = (query = {}) =>
  findPaginated(buildFilter(query), query, 10);

const getQuestionBank = (query = {}) =>
  findPaginated(
    buildFilter(query, { publishedOnly: true, allowSearch: true }),
    query,
    9
  );

const getQuestionById = (id) => Question.findById(id);
const createQuestion = (data) => Question.create(data);
const updateQuestion = (id, data) =>
  Question.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteQuestion = (id) => Question.findByIdAndDelete(id);

module.exports = {
  getQuestions,
  getQuestionBank,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
