const validateEnv = () => {
  const required = ["MONGO_URI", "JWT_SECRET"];
  if (process.env.NODE_ENV === "production") required.push("CLIENT_URL");

  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) throw new Error(`Thiếu biến môi trường: ${missing.join(", ")}`);

  if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET production phải có ít nhất 32 ký tự");
  }
};

module.exports = validateEnv;
