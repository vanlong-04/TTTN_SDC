const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Nội dung câu hỏi không được để trống"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["multiple_choice", "short_answer"],
      required: [true, "Loại câu hỏi không được để trống"],
    },
    options: [{ type: String, trim: true }],
    correctAnswer: {
      type: String,
      required: [true, "Đáp án đúng không được để trống"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    tags: [{ type: String, trim: true }],
    explanation: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
  },
  { timestamps: true }
);

questionSchema.pre("validate", function () {
  if (this.type === "multiple_choice" && this.options.length < 2) {
    this.invalidate(
      "options",
      "Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn"
    );
  }
});

module.exports = mongoose.model("Question", questionSchema);
