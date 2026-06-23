const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./src/config/db");
const Question = require("./src/models/Question");
const Quiz = require("./src/models/Quiz");
const Submission = require("./src/models/Submission");
const User = require("./src/models/User");

const mc = (content, options, correctAnswer, difficulty, tags, explanation) => ({
  content,
  type: "multiple_choice",
  options,
  correctAnswer,
  difficulty,
  tags,
  explanation,
  status: "published",
});

const sa = (content, correctAnswer, difficulty, tags) => ({
  content,
  type: "short_answer",
  options: [],
  correctAnswer,
  difficulty,
  tags,
  explanation: correctAnswer,
  status: "published",
});

const questions = [
  mc("Kiểu dữ liệu nào không phải kiểu nguyên thủy trong JavaScript?", ["A. string", "B. number", "C. object", "D. boolean"], "C", "Easy", ["JavaScript"], "Object là kiểu tham chiếu, không phải kiểu nguyên thủy."),
  mc("Kết quả của typeof null là gì?", ["A. null", "B. object", "C. undefined", "D. boolean"], "B", "Medium", ["JavaScript"], "Đây là một đặc điểm lịch sử của JavaScript."),
  mc("Phương thức nào tạo mảng mới bằng cách biến đổi từng phần tử?", ["A. forEach", "B. map", "C. find", "D. some"], "B", "Easy", ["JavaScript"], "map trả về một mảng mới sau khi gọi callback cho từng phần tử."),
  mc("Từ khóa nào khai báo biến có block scope và cho phép gán lại?", ["A. var", "B. const", "C. let", "D. static"], "C", "Easy", ["JavaScript"], "let có block scope và có thể được gán lại."),
  mc("Promise ở trạng thái nào sau khi resolve thành công?", ["A. pending", "B. fulfilled", "C. rejected", "D. stopped"], "B", "Easy", ["JavaScript"], "Promise chuyển sang fulfilled sau khi resolve."),
  mc("Toán tử nào so sánh cả giá trị và kiểu dữ liệu?", ["A. ==", "B. =", "C. ===", "D. !="], "C", "Easy", ["JavaScript"], "=== thực hiện so sánh nghiêm ngặt."),
  mc("Array.prototype.find trả về gì khi không tìm thấy phần tử?", ["A. null", "B. false", "C. -1", "D. undefined"], "D", "Medium", ["JavaScript"], "find trả về undefined nếu không có phần tử phù hợp."),
  mc("Cú pháp nào sao chép nông một object?", ["A. {...object}", "B. [object]", "C. object.copy()", "D. clone object"], "A", "Medium", ["JavaScript"], "Spread syntax tạo một bản sao nông."),
  sa("Phân biệt let, const và var trong JavaScript.", "var có function scope; let và const có block scope; const không cho phép gán lại binding.", "Medium", ["JavaScript"]),
  sa("Giải thích event loop trong JavaScript.", "Event loop phối hợp call stack và các hàng đợi tác vụ để xử lý công việc bất đồng bộ mà không chặn luồng chính.", "Hard", ["JavaScript"]),

  mc("Hook nào dùng để quản lý state trong functional component?", ["A. useEffect", "B. useState", "C. useMemo", "D. useRef"], "B", "Easy", ["ReactJS", "JavaScript"], "useState khai báo và cập nhật state."),
  mc("Prop key giúp React làm gì khi render danh sách?", ["A. Mã hóa dữ liệu", "B. Nhận diện phần tử thay đổi", "C. Gọi API", "D. Tạo CSS"], "B", "Easy", ["ReactJS"], "key giúp thuật toán reconciliation nhận diện phần tử."),
  mc("useEffect với dependency array rỗng thường chạy khi nào?", ["A. Mỗi render", "B. Sau lần mount", "C. Trước render", "D. Không bao giờ"], "B", "Medium", ["ReactJS"], "Effect chạy sau lần render đầu tiên và cleanup khi unmount."),
  mc("Cách cập nhật state dựa trên state trước đó an toàn là gì?", ["A. setCount(count + 1)", "B. count++", "C. setCount(prev => prev + 1)", "D. this.count = 1"], "C", "Medium", ["ReactJS", "JavaScript"], "Functional updater luôn nhận giá trị state gần nhất."),
  mc("Hook nào lưu giá trị qua các lần render mà không gây render lại?", ["A. useRef", "B. useEffect", "C. useContext", "D. useId"], "A", "Medium", ["ReactJS"], "Thay đổi ref.current không kích hoạt render."),
  mc("React component phải trả về gì?", ["A. Một React node hoặc null", "B. Chỉ chuỗi", "C. Chỉ div", "D. Một Promise"], "A", "Easy", ["ReactJS"], "Component có thể trả về React node, fragment hoặc null."),
  mc("useMemo phù hợp nhất cho trường hợp nào?", ["A. Điều hướng", "B. Cache kết quả tính toán tốn kém", "C. Gọi API bắt buộc", "D. Thay thế mọi state"], "B", "Hard", ["ReactJS"], "useMemo ghi nhớ kết quả tính toán theo dependencies."),
  mc("Controlled input lấy giá trị hiển thị từ đâu?", ["A. DOM tự quản lý", "B. React state", "C. LocalStorage bắt buộc", "D. CSS"], "B", "Easy", ["ReactJS"], "Controlled input nhận value từ state và cập nhật qua event."),
  sa("Giải thích sự khác nhau giữa props và state trong React.", "Props được component cha truyền vào và chỉ đọc; state là dữ liệu nội bộ có thể cập nhật để gây render lại.", "Medium", ["ReactJS"]),
  sa("Reconciliation trong React là gì?", "Reconciliation là quá trình React so sánh cây UI mới với cây trước để cập nhật DOM tối thiểu cần thiết.", "Hard", ["ReactJS"]),

  mc("Express middleware nhận ba tham số phổ biến nào?", ["A. req, res, next", "B. app, db, next", "C. get, post, put", "D. user, token, role"], "A", "Easy", ["NodeJS", "ExpressJS"], "Middleware Express thường có chữ ký req, res, next."),
  mc("HTTP status phù hợp khi tạo resource thành công là gì?", ["A. 200", "B. 201", "C. 301", "D. 404"], "B", "Easy", ["NodeJS", "ExpressJS"], "201 Created biểu thị resource đã được tạo."),
  mc("Biến môi trường trong Node.js được đọc qua đâu?", ["A. process.env", "B. window.env", "C. document.env", "D. node.config"], "A", "Easy", ["NodeJS"], "Node cung cấp các biến môi trường trong process.env."),
  mc("JWT thường được gửi trong header nào?", ["A. Content-Length", "B. Authorization", "C. Accept-Language", "D. Host"], "B", "Easy", ["NodeJS", "JWT"], "JWT thường dùng Authorization: Bearer token."),
  mc("Mongoose populate dùng để làm gì?", ["A. Join dữ liệu từ document tham chiếu", "B. Mã hóa password", "C. Khởi động server", "D. Parse JSON"], "A", "Medium", ["NodeJS", "MongoDB"], "populate thay ObjectId tham chiếu bằng dữ liệu document liên quan."),
  mc("Middleware xử lý lỗi Express có bao nhiêu tham số?", ["A. 2", "B. 3", "C. 4", "D. 5"], "C", "Medium", ["NodeJS", "ExpressJS"], "Error middleware có chữ ký err, req, res, next."),
  mc("bcrypt được dùng chủ yếu để làm gì?", ["A. Hash mật khẩu", "B. Tạo route", "C. Gọi API", "D. Render giao diện"], "A", "Easy", ["NodeJS", "Security"], "bcrypt là thuật toán hash mật khẩu có salt và cost."),
  mc("Phương thức HTTP nào thường dùng để cập nhật một phần resource?", ["A. GET", "B. PATCH", "C. OPTIONS", "D. HEAD"], "B", "Easy", ["NodeJS", "REST API"], "PATCH thường biểu thị cập nhật một phần resource."),
  sa("Mô tả luồng xác thực JWT trong Express.", "Server kiểm tra Bearer token, xác minh chữ ký và hạn dùng, lấy user từ payload rồi gắn user vào request trước khi chuyển sang controller.", "Medium", ["NodeJS", "JWT"]),
  sa("Tại sao cần xử lý lỗi tập trung trong API Express?", "Xử lý lỗi tập trung giúp response nhất quán, tránh lộ thông tin nhạy cảm và giảm lặp code try/catch trong controller.", "Hard", ["NodeJS", "ExpressJS"]),
];

const ensureDemoUser = async (username, email, password) => {
  let user = await User.findOne({ email });
  if (!user) user = await User.create({ username, email, password, role: "user" });
  return user;
};

const upsertQuiz = async (data) => {
  let quiz = await Quiz.findOne({ title: data.title });
  if (!quiz) quiz = new Quiz(data);
  else Object.assign(quiz, data);
  await quiz.save();
  return quiz;
};

const seed = async () => {
  if (!process.env.MONGO_URI) throw new Error("Thiếu biến môi trường MONGO_URI");
  await connectDB();

  const operations = questions.map((question) => ({
    updateOne: {
      filter: { content: question.content },
      update: { $set: question },
      upsert: true,
    },
  }));
  await Question.bulkWrite(operations);

  const savedQuestions = await Question.find({
    content: { $in: questions.map((question) => question.content) },
  });
  const byTag = (tag) => savedQuestions.filter((question) => question.tags.includes(tag));

  const demoPassword = process.env.DEMO_USER_PASSWORD ||
    (process.env.NODE_ENV === "production" ? null : "DemoUser@123");
  if (!demoPassword) throw new Error("Production bắt buộc khai báo DEMO_USER_PASSWORD");

  const [candidateOne, candidateTwo] = await Promise.all([
    ensureDemoUser("Nguyễn Minh Anh", "candidate1@example.com", demoPassword),
    ensureDemoUser("Trần Hoàng Nam", "candidate2@example.com", demoPassword),
  ]);

  const javascript = byTag("JavaScript").slice(0, 8);
  const react = byTag("ReactJS").slice(0, 10);
  const node = byTag("NodeJS").slice(0, 10);

  const [jsQuiz, reactQuiz, nodeQuiz] = await Promise.all([
    upsertQuiz({ title: "JavaScript Foundation", description: "Kiểm tra kiến thức JavaScript nền tảng cho Fresher.", questions: javascript.map((q) => q._id), duration: 20, tags: ["JavaScript"], difficulty: "Easy", status: "published" }),
    upsertQuiz({ title: "ReactJS Interview Practice", description: "Đề tổng hợp React hooks, component và rendering.", questions: react.map((q) => q._id), duration: 30, tags: ["ReactJS", "JavaScript"], difficulty: "Mixed", status: "published" }),
    upsertQuiz({ title: "NodeJS Backend Challenge", description: "Luyện API, Express, MongoDB, JWT và bảo mật backend.", questions: node.map((q) => q._id), duration: 30, tags: ["NodeJS", "ExpressJS"], difficulty: "Mixed", status: "published" }),
  ]);
  await upsertQuiz({ title: "Fullstack Interview Draft", description: "Đề tổng hợp đang được biên soạn.", questions: [...react.slice(0, 3), ...node.slice(0, 3)].map((q) => q._id), duration: 25, tags: ["ReactJS", "NodeJS"], difficulty: "Mixed", status: "draft" });

  if (!(await Submission.exists({ user: candidateOne._id, quiz: jsQuiz._id }))) {
    const answers = javascript.map((question, index) => ({
      question: question._id,
      userAnswer: index < 6 ? question.correctAnswer : "",
      isCorrect: index < 6,
      score: index < 6 ? 1 : 0,
    }));
    await Submission.create({ user: candidateOne._id, quiz: jsQuiz._id, answers, totalScore: 6, maxScore: javascript.length, status: "auto_graded", submittedAt: new Date(Date.now() - 86400000) });
  }

  if (!(await Submission.exists({ user: candidateTwo._id, quiz: reactQuiz._id }))) {
    const answers = react.map((question, index) => ({
      question: question._id,
      userAnswer: question.type === "multiple_choice" && index < 5 ? question.correctAnswer : "Câu trả lời demo đang chờ nhận xét.",
      isCorrect: question.type === "multiple_choice" && index < 5,
      score: question.type === "multiple_choice" && index < 5 ? 1 : 0,
    }));
    await Submission.create({ user: candidateTwo._id, quiz: reactQuiz._id, answers, totalScore: 5, maxScore: 8, status: "pending_review", submittedAt: new Date() });
  }

  console.log(`Seed hoàn tất: ${savedQuestions.length} câu hỏi, 2 user, 4 đề thi và dữ liệu bài làm mẫu.`);
  console.log("Demo users: candidate1@example.com, candidate2@example.com");
  console.log("Mật khẩu demo lấy từ DEMO_USER_PASSWORD (hoặc mặc định development). ");
  return { jsQuiz, reactQuiz, nodeQuiz };
};

seed()
  .catch((error) => {
    console.error("Seed thất bại:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
