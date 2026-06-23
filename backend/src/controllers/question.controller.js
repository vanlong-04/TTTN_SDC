const questionService = require("../services/question.service");
const AppError = require("../utils/AppError");

exports.getQuestions = async (req, res) => {
  const result = await questionService.getQuestions(req.query);
  res.status(200).json({ success: true, message: "Lấy danh sách câu hỏi thành công", data: result });
};

exports.getQuestionBank = async (req, res) => {
  const result = await questionService.getQuestionBank(req.query);
  res.status(200).json({ success: true, message: "Lấy ngân hàng câu hỏi thành công", data: result });
};

exports.getQuestionById = async (req, res) => {
  const question = await questionService.getQuestionById(req.params.id);
  if (!question) throw new AppError("Không tìm thấy câu hỏi", 404);
  res.status(200).json({ success: true, message: "Lấy chi tiết câu hỏi thành công", data: question });
};

exports.createQuestion = async (req, res) => {
  const question = await questionService.createQuestion(req.body);
  res.status(201).json({ success: true, message: "Tạo câu hỏi thành công", data: question });
};

exports.updateQuestion = async (req, res) => {
  const question = await questionService.updateQuestion(req.params.id, req.body);
  if (!question) throw new AppError("Không tìm thấy câu hỏi để cập nhật", 404);
  res.status(200).json({ success: true, message: "Cập nhật câu hỏi thành công", data: question });
};

exports.deleteQuestion = async (req, res) => {
  const question = await questionService.deleteQuestion(req.params.id);
  if (!question) throw new AppError("Không tìm thấy câu hỏi để xóa", 404);
  res.status(200).json({ success: true, message: "Xóa câu hỏi thành công" });
};
