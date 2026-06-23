const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    userAnswer: {
      type: String,
      trim: true,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    reviewerComment: {
      type: String,
      default: "",
    },

    manualScore: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    answers: [answerSchema],

    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["auto_graded", "pending_review", "reviewed"],
      default: "auto_graded",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);
