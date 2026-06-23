require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const validateEnv = require("./src/config/validate-env");

const startServer = async () => {
  validateEnv();
  await connectDB();

  const port = process.env.PORT || 5000;
  return app.listen(port, () => {
    console.log(`Server đang chạy tại port ${port}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Không thể khởi động server:", error.message);
    process.exit(1);
  });
}

const shutdown = async () => {
  await mongoose.disconnect();
  process.exit(0);
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

module.exports = { app, startServer };
