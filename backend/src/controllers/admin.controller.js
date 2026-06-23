const adminService = require("../services/admin.service");

exports.getDashboardStats = async (req, res) => {
  const result = await adminService.getDashboardStats();

  res.status(200).json({
    success: true,
    message: "Lấy thống kê dashboard thành công",
    data: result,
  });
};

exports.getAdminSubmissions = async (req, res) => {
  const result = await adminService.getAdminSubmissions(req.query);

  res.status(200).json({
    success: true,
    message: "Lấy danh sách bài nộp thành công",
    data: result,
  });
};

exports.getAdminSubmissionById = async (req, res) => {
  const submission = await adminService.getAdminSubmissionById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Lấy chi tiết bài nộp thành công",
    data: submission,
  });
};

exports.reviewSubmission = async (req, res) => {
  const result = await adminService.reviewSubmission(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Chấm bài tự luận thành công",
    data: result,
  });
};
