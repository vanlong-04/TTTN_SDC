const express = require("express");
const authController = require("../controllers/auth.controller");
const protect = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate.middleware");
const { registerValidator, loginValidator } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", registerValidator, validate, asyncHandler(authController.register));
router.post("/login", loginValidator, validate, asyncHandler(authController.login));
router.get("/me", asyncHandler(protect), asyncHandler(authController.getProfile));

module.exports = router;
