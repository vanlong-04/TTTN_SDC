const categoryService = require("../services/category.service");

exports.getAllCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({
    success: true,
    data: categories,
  });
};

exports.getCategoryById = async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.status(200).json({
    success: true,
    data: category,
  });
};

exports.createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({
    success: true,
    message: "Tạo danh mục thành công",
    data: category,
  });
};

exports.updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Cập nhật danh mục thành công",
    data: category,
  });
};

exports.deleteCategory = async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.id);
  res.status(200).json({
    success: true,
    message: "Xóa danh mục thành công",
    data: category,
  });
};
