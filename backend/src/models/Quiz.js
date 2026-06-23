const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tên đề thi không được để trống"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    duration: {
      type: Number,
      required: [true, "Thời gian làm bài không được để trống"],
      min: [1, "Thời gian làm bài phải lớn hơn 0"],
    },
    tags: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Mixed"],
      default: "Mixed",
    },
    questionCount: {
      type: Number,
      min: [1, "Số câu hỏi phải lớn hơn 0"],
      default: 10,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

quizSchema.pre("validate", function () {
  if (!this.questions?.length) {
    this.invalidate("questions", "Đề thi phải có ít nhất 1 câu hỏi");
  }

  if (this.questions?.length) {
    this.questionCount = this.questions.length;
  }
});

module.exports = mongoose.model("Quiz", quizSchema);
