const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const hpp = require("hpp");
const apiRoutes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const sanitizeRequest = require("./middlewares/mongo-sanitize.middleware");
const AppError = require("./utils/AppError");

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      return callback(null, true);
    }
    return callback(new AppError("Origin không được CORS cho phép", 403));
  },
}));
app.use(express.json({ limit: "10kb" }));
app.use(sanitizeRequest);
// Query pollution được từ chối ở sanitizeRequest để tương thích req.query getter của Express 5.
app.use(hpp({ checkQuery: false }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Quá nhiều request, vui lòng thử lại sau" },
}));

app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Quá nhiều lần xác thực, vui lòng thử lại sau" },
}));

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "IT Interview Mock Test API is running" });
});

app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
