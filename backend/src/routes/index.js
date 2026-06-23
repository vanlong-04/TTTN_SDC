const express = require("express");
const authRoutes = require("./auth.routes");
const questionRoutes = require("./question.routes");
const quizRoutes = require("./quiz.routes");
const submissionRoutes = require("./submission.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/questions", questionRoutes);
router.use("/quizzes", quizRoutes);
router.use("/submissions", submissionRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
