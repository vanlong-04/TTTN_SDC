const express = require("express");
const adminController = require("../controllers/admin.controller");
const protect = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(asyncHandler(protect));
router.use(allowRoles("admin"));

router.get("/dashboard", asyncHandler(adminController.getDashboardStats));
router.get("/submissions", asyncHandler(adminController.getAdminSubmissions));
router.get("/submissions/:id", asyncHandler(adminController.getAdminSubmissionById));
router.patch("/submissions/:id/review", asyncHandler(adminController.reviewSubmission));

module.exports = router;
