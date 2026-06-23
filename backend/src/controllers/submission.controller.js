const submissionService = require("../services/submission.service");
const AppError = require("../utils/AppError");

exports.submitQuiz = async (req, res) => {
  const result = await submissionService.submitQuiz({
    ...req.body,
    user_id: req.user._id,
  });
  res.status(201).json({ success: true, message: "Nộp bài thành công", data: result });
};

exports.getUserSubmissions = async (req, res) => {
  const submissions = await submissionService.getUserSubmissions(req.user._id);
  res.status(200).json({ success: true, message: "Lấy lịch sử làm bài thành công", data: submissions });
};

exports.getSubmissionById = async (req, res) => {
  const submission = await submissionService.getSubmissionById(req.params.id, req.user);
  if (!submission) throw new AppError("Không tìm thấy bài nộp", 404);
  res.status(200).json({ success: true, message: "Lấy chi tiết bài nộp thành công", data: submission });
};
