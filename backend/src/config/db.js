const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Thiếu biến môi trường MONGO_URI");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Kết nối MongoDB thành công");

  return mongoose.connection;
};

module.exports = connectDB;
