const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../src/config/db");
const Question = require("../src/models/Question");
const Quiz = require("../src/models/Quiz");
const User = require("../src/models/User");

const letters = ["A", "B", "C", "D"];
const question = (content, choices, correctIndex, difficulty, tags, explanation) => ({
  content,
  type: "multiple_choice",
  options: choices.map((choice, index) => `${letters[index]}. ${choice}`),
  correctAnswer: letters[correctIndex],
  difficulty,
  tags,
  explanation,
  status: "published",
});

const questions = [
  // MongoDB
  question("MongoDB lưu dữ liệu chính dưới dạng nào?", ["Document BSON", "Hàng CSV", "File XML", "Đồ thị bắt buộc"], 0, "Easy", ["MongoDB"], "MongoDB lưu document theo định dạng BSON."),
  question("Lệnh Mongoose nào tìm một document theo ID?", ["findById", "getByKey", "selectId", "lookupOne"], 0, "Easy", ["MongoDB", "NodeJS"], "Model.findById(id) tìm document theo _id."),
  question("MongoDB index có mục đích chính gì?", ["Tăng tốc truy vấn", "Mã hóa collection", "Thay schema", "Tạo API"], 0, "Medium", ["MongoDB"], "Index giảm số document phải quét khi truy vấn."),
  question("Aggregation stage nào dùng để lọc document?", ["$match", "$group", "$project", "$unwind"], 0, "Medium", ["MongoDB"], "$match lọc document theo điều kiện."),
  question("populate trong Mongoose hoạt động dựa trên trường nào?", ["ObjectId tham chiếu", "CSS selector", "JWT token", "HTTP header"], 0, "Medium", ["MongoDB", "Mongoose"], "populate thay ObjectId ref bằng document liên quan."),
  question("Thuộc tính unique trong Mongoose chủ yếu tạo ra gì?", ["Unique index", "Validator phía client", "Hash", "Transaction"], 0, "Hard", ["MongoDB", "Mongoose"], "unique là shorthand tạo unique index, không phải validator Mongoose thông thường."),
  question("Transaction MongoDB phù hợp khi nào?", ["Nhiều thao tác phải cùng thành công", "Mọi truy vấn đọc", "Render React", "Gửi email"], 0, "Hard", ["MongoDB"], "Transaction đảm bảo tính nguyên tử trên nhiều thao tác/document."),
  question("Phương thức lean() của Mongoose trả về gì?", ["Plain JavaScript object", "Mongoose document đầy đủ", "Cursor SQL", "Chuỗi JSON"], 0, "Hard", ["MongoDB", "Mongoose"], "lean bỏ hydration và trả plain object, phù hợp truy vấn chỉ đọc."),

  // TypeScript
  question("TypeScript bổ sung khả năng chính nào cho JavaScript?", ["Kiểu tĩnh", "Database tích hợp", "CSS module", "HTTP server"], 0, "Easy", ["TypeScript", "JavaScript"], "TypeScript thêm hệ thống kiểu tĩnh và được biên dịch thành JavaScript."),
  question("Từ khóa nào định nghĩa cấu trúc object trong TypeScript?", ["interface", "package", "module.exports", "structural"], 0, "Easy", ["TypeScript"], "interface mô tả shape của object."),
  question("Kiểu union được viết như thế nào?", ["string | number", "string & number", "string + number", "union(string, number)"], 0, "Easy", ["TypeScript"], "Dấu | kết hợp nhiều kiểu thành union."),
  question("unknown an toàn hơn any vì sao?", ["Phải thu hẹp kiểu trước khi dùng", "Luôn là string", "Không nhận giá trị", "Tự mã hóa"], 0, "Medium", ["TypeScript"], "unknown yêu cầu type narrowing trước khi thao tác."),
  question("Generic <T> dùng để làm gì?", ["Tái sử dụng logic với nhiều kiểu", "Tạo route", "Chạy bất đồng bộ", "Ẩn biến"], 0, "Medium", ["TypeScript"], "Generic giữ quan hệ kiểu khi code làm việc với nhiều kiểu dữ liệu."),
  question("Utility type Partial<T> tạo kiểu như thế nào?", ["Mọi thuộc tính thành optional", "Mọi thuộc tính readonly", "Bỏ mọi thuộc tính", "Chỉ giữ method"], 0, "Medium", ["TypeScript"], "Partial biến tất cả property của T thành tùy chọn."),
  question("never thường biểu diễn điều gì?", ["Giá trị không bao giờ xảy ra", "Giá trị null", "Mọi kiểu", "Object rỗng"], 0, "Hard", ["TypeScript"], "never dùng cho nhánh bất khả thi hoặc hàm không bao giờ trả về."),
  question("Type guard tùy chỉnh thường trả về kiểu gì?", ["value is Type", "boolean<Type>", "Type.value", "guard Type"], 0, "Hard", ["TypeScript"], "Type predicate value is Type giúp compiler thu hẹp kiểu."),

  // HTML/CSS
  question("Thẻ HTML nào phù hợp cho nội dung điều hướng?", ["nav", "div", "span", "strong"], 0, "Easy", ["HTML", "Frontend"], "nav mang semantic cho khu vực điều hướng."),
  question("Thuộc tính alt của ảnh hỗ trợ chính cho gì?", ["Khả năng truy cập", "Tăng kích thước ảnh", "Chạy JavaScript", "Kết nối API"], 0, "Easy", ["HTML", "Accessibility"], "alt mô tả ảnh cho screen reader và khi ảnh không tải được."),
  question("CSS display: grid phù hợp nhất với layout nào?", ["Hai chiều hàng và cột", "Chỉ chữ", "Chỉ animation", "Database table"], 0, "Easy", ["CSS", "Frontend"], "Grid được thiết kế cho bố cục hai chiều."),
  question("box-sizing: border-box có tác dụng gì?", ["Gộp padding và border vào kích thước", "Ẩn overflow", "Xóa margin", "Tạo flexbox"], 0, "Medium", ["CSS"], "Width/height đã bao gồm padding và border."),
  question("Đơn vị rem phụ thuộc vào đâu?", ["Font-size phần tử gốc", "Chiều rộng viewport", "Phần tử cha trực tiếp", "DPI màn hình"], 0, "Medium", ["CSS"], "rem tính theo font-size của root element."),
  question("Selector :focus-visible hữu ích cho gì?", ["Hiển thị focus phù hợp khi dùng bàn phím", "Ẩn input", "Chạy media query", "Tạo pseudo element"], 0, "Medium", ["CSS", "Accessibility"], ":focus-visible giúp focus indicator thân thiện với người dùng bàn phím."),
  question("CSS specificity nào thường cao hơn?", ["ID selector", "Class selector", "Element selector", "Universal selector"], 0, "Hard", ["CSS"], "ID selector có specificity cao hơn class và element."),
  question("contain trong CSS có thể giúp gì?", ["Giới hạn phạm vi layout/paint để tối ưu", "Mã hóa style", "Tạo API", "Thay HTML"], 0, "Hard", ["CSS", "Performance"], "CSS containment giúp trình duyệt cô lập công việc render."),

  // OOP
  question("Đóng gói trong OOP nhằm mục đích gì?", ["Ẩn chi tiết và kiểm soát truy cập", "Nhân đôi object", "Xóa class", "Thay database"], 0, "Easy", ["OOP"], "Encapsulation bảo vệ trạng thái và cung cấp giao diện sử dụng rõ ràng."),
  question("Kế thừa mô tả quan hệ nào?", ["is-a", "has-a", "uses-a bắt buộc", "database-a"], 0, "Easy", ["OOP"], "Inheritance thường mô hình hóa quan hệ is-a."),
  question("Đa hình cho phép điều gì?", ["Cùng interface, nhiều cách triển khai", "Chỉ một class", "Không dùng method", "Mọi biến private"], 0, "Medium", ["OOP"], "Polymorphism cho phép gọi cùng contract trên nhiều implementation."),
  question("Composition thường mô tả quan hệ nào?", ["has-a", "is-a", "equals-a", "extends-a bắt buộc"], 0, "Medium", ["OOP"], "Composition xây object từ các object thành phần."),
  question("SOLID: chữ S là nguyên tắc nào?", ["Single Responsibility", "Safe Runtime", "Static Relation", "Service Repository"], 0, "Medium", ["OOP", "SOLID"], "Một class/module nên có một lý do để thay đổi."),
  question("Dependency Inversion khuyến khích phụ thuộc vào gì?", ["Abstraction", "Concrete class", "Global variable", "Database cụ thể"], 0, "Hard", ["OOP", "SOLID"], "Module cấp cao và thấp nên phụ thuộc abstraction."),
  question("Liskov Substitution yêu cầu điều gì?", ["Subtype thay được base type mà không phá hành vi", "Mọi class phải static", "Không được kế thừa", "Method phải private"], 0, "Hard", ["OOP", "SOLID"], "Subtype phải tôn trọng contract của base type."),
  question("Factory pattern giúp tách phần nào?", ["Logic khởi tạo object", "CSS rendering", "HTTP caching", "Database indexing"], 0, "Medium", ["OOP", "Design Pattern"], "Factory đóng gói quyết định và quy trình tạo object."),

  // SQL
  question("Câu lệnh SQL nào đọc dữ liệu?", ["SELECT", "UPDATE", "DELETE", "DROP"], 0, "Easy", ["SQL", "Database"], "SELECT truy vấn dữ liệu từ bảng."),
  question("PRIMARY KEY đảm bảo điều gì?", ["Duy nhất và không null", "Mọi giá trị giống nhau", "Tự join", "Tự mã hóa"], 0, "Easy", ["SQL", "Database"], "Primary key định danh duy nhất từng hàng."),
  question("INNER JOIN trả về gì?", ["Các hàng khớp ở cả hai bảng", "Mọi hàng bảng trái", "Mọi hàng hai bảng", "Không hàng nào"], 0, "Medium", ["SQL"], "INNER JOIN chỉ giữ các bản ghi có điều kiện join khớp."),
  question("GROUP BY thường kết hợp với gì?", ["Hàm tổng hợp", "CSS selector", "JWT", "HTTP method"], 0, "Medium", ["SQL"], "GROUP BY nhóm hàng để dùng COUNT, SUM, AVG..."),
  question("HAVING khác WHERE ở điểm nào?", ["Lọc sau khi grouping", "Chỉ dùng để sort", "Tạo index", "Xóa bảng"], 0, "Medium", ["SQL"], "HAVING lọc kết quả nhóm, WHERE lọc hàng trước grouping."),
  question("Normalization giúp giảm vấn đề gì?", ["Dư thừa và anomaly dữ liệu", "Tốc độ mạng", "Kích thước CSS", "JWT expiry"], 0, "Hard", ["SQL", "Database"], "Chuẩn hóa giảm lặp dữ liệu và bất thường khi cập nhật."),
  question("Mức isolation cao nhất trong SQL chuẩn là gì?", ["Serializable", "Read committed", "Read uncommitted", "Repeatable read"], 0, "Hard", ["SQL", "Database"], "Serializable cung cấp mức cô lập mạnh nhất."),
  question("Composite index (a, b) thường hỗ trợ tốt truy vấn nào?", ["Theo a hoặc a,b", "Chỉ theo b trong mọi trường hợp", "Không truy vấn nào", "Chỉ DELETE"], 0, "Hard", ["SQL", "Database"], "Quy tắc leftmost prefix thường hỗ trợ a và tổ hợp bắt đầu bằng a."),

  // Git / Testing / Security
  question("git pull thường kết hợp hai thao tác nào?", ["fetch và merge/rebase", "add và commit", "clone và push", "stash và tag"], 0, "Easy", ["Git"], "pull lấy thay đổi remote rồi tích hợp vào branch hiện tại."),
  question("Unit test tập trung kiểm tra gì?", ["Một đơn vị logic nhỏ độc lập", "Toàn bộ hệ thống production", "Thiết kế UI", "Cấu hình DNS"], 0, "Easy", ["Testing"], "Unit test kiểm tra hàm/module nhỏ với dependency được cô lập."),
  question("Integration test kiểm tra điều gì?", ["Các thành phần phối hợp với nhau", "Chỉ một dòng code", "Màu giao diện", "Git history"], 0, "Medium", ["Testing"], "Integration test xác minh ranh giới giữa module, DB hoặc API."),
  question("XSS xảy ra khi nào?", ["Dữ liệu không tin cậy được thực thi như script", "Query DB chậm", "Token hết hạn", "CSS không tải"], 0, "Medium", ["Security", "Web"], "XSS cho phép nội dung độc hại chạy trong trình duyệt người dùng."),
  question("CSRF khai thác điều gì?", ["Trình duyệt tự gửi thông tin xác thực", "Mật khẩu hash", "MongoDB index", "React state"], 0, "Hard", ["Security", "Web"], "CSRF dụ trình duyệt gửi request đã xác thực ngoài ý muốn."),
  question("Nguyên tắc least privilege yêu cầu gì?", ["Chỉ cấp quyền tối thiểu cần thiết", "Mọi user là admin", "Không cần xác thực", "Chia sẻ mật khẩu"], 0, "Easy", ["Security"], "Mỗi tài khoản chỉ nên có quyền đủ để thực hiện nhiệm vụ."),
  question("Mock trong kiểm thử dùng để làm gì?", ["Thay dependency bằng bản kiểm soát được", "Deploy production", "Tạo index", "Minify CSS"], 0, "Medium", ["Testing"], "Mock giúp kiểm soát hành vi dependency và quan sát tương tác."),
  question("git rebase có tác dụng chính gì?", ["Đặt lại commit lên một base mới", "Xóa remote", "Mã hóa repository", "Tạo database"], 0, "Hard", ["Git"], "Rebase phát lại commit trên một điểm cơ sở mới để lịch sử tuyến tính hơn."),
];

const quizDefinitions = [
  { title: "MongoDB & Mongoose Essentials", tags: ["MongoDB"], duration: 20, difficulty: "Mixed" },
  { title: "TypeScript Interview Set", tags: ["TypeScript"], duration: 20, difficulty: "Mixed" },
  { title: "HTML CSS Frontend Core", tags: ["HTML", "CSS"], duration: 20, difficulty: "Mixed" },
  { title: "OOP & SOLID Practice", tags: ["OOP"], duration: 20, difficulty: "Mixed" },
  { title: "SQL Database Interview", tags: ["SQL"], duration: 20, difficulty: "Mixed" },
  { title: "Git Testing Security Mix", tags: ["Git", "Testing", "Security"], duration: 20, difficulty: "Mixed" },
];

const seedMore = async () => {
  await connectDB();

  const result = await Question.bulkWrite(
    questions.map((item) => ({
      updateOne: {
        filter: { content: item.content },
        update: { $setOnInsert: item },
        upsert: true,
      },
    }))
  );

  const admin = await User.findOne({ role: "admin" }).select("_id");
  for (const definition of quizDefinitions) {
    const quizQuestions = await Question.find({
      tags: { $in: definition.tags },
      status: "published",
    }).sort({ createdAt: 1 }).limit(10).select("_id");

    if (quizQuestions.length < 5) continue;

    let quiz = await Quiz.findOne({ title: definition.title });
    if (!quiz) quiz = new Quiz();
    Object.assign(quiz, {
      ...definition,
      description: `Bộ câu hỏi luyện phỏng vấn chủ đề ${definition.tags.join(", ")}.`,
      questions: quizQuestions.map((item) => item._id),
      status: "published",
      createdBy: admin?._id || null,
    });
    await quiz.save();
  }

  const [questionCount, quizCount] = await Promise.all([
    Question.countDocuments(),
    Quiz.countDocuments(),
  ]);
  console.log(`Seed bổ sung hoàn tất: thêm mới ${result.upsertedCount}/${questions.length} câu hỏi.`);
  console.log(`Database hiện có ${questionCount} câu hỏi và ${quizCount} đề thi.`);
};

seedMore()
  .catch((error) => {
    console.error("Seed bổ sung thất bại:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
