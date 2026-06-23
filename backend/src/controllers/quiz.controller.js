const quizService = require("../services/quiz.service");

exports.getPublishedQuizzes = async (req, res) => {
  const result = await quizService.getPublishedQuizzes(req.query);
  res.status(200).json({
    success: true,
    message: "Lấy danh sách đề thi đã xuất bản thành công",
    data: result,
  });
};

exports.getPublishedQuizById = async (req, res) => {
  const result = await quizService.getPublishedQuizById(req.params.id);
  res.status(200).json({
    success: true,
    message: "Lấy đề thi thành công",
    data: result,
  });
};

exports.generateQuiz = async (req, res) => {
  const result = await quizService.generateQuiz(req.body, req.user._id);
  res.status(201).json({ success: true, message: "Tạo đề thi ngẫu nhiên thành công", data: result });
};

exports.createQuiz = async (req, res) => {
  const quiz = await quizService.createQuiz(req.body, req.user._id);
  res.status(201).json({ success: true, message: "Tạo đề thi thành công", data: quiz });
};

exports.getQuizzes = async (req, res) => {
  const result = await quizService.getQuizzes(req.query);
  res.status(200).json({ success: true, message: "Lấy danh sách đề thi thành công", data: result });
};

exports.getQuizById = async (req, res) => {
  const quiz = await quizService.getQuizById(req.params.id);
  res.status(200).json({ success: true, message: "Lấy chi tiết đề thi thành công", data: quiz });
};

exports.updateQuiz = async (req, res) => {
  const quiz = await quizService.updateQuiz(req.params.id, req.body);
  res.status(200).json({ success: true, message: "Cập nhật đề thi thành công", data: quiz });
};

exports.deleteQuiz = async (req, res) => {
  await quizService.deleteQuiz(req.params.id);
  res.status(200).json({ success: true, message: "Xóa đề thi thành công" });
};
