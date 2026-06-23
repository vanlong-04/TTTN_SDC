const normalizeAnswer = (answer) =>
  answer == null ? "" : answer.toString().trim().toLowerCase();

const compareAnswer = (submittedAnswer, correctAnswer) =>
  normalizeAnswer(submittedAnswer) === normalizeAnswer(correctAnswer);

module.exports = compareAnswer;
module.exports.compareAnswer = compareAnswer;
