const User = require("../models/userSchema.model");
const CustomError = require("../utils/CustomError");
const cookieOptions = require("../utils/cookieOptions");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new CustomError("email id is required", 400);
  }
  if (email && typeof email !== "string") {
    throw new CustomError("email id should be of type string", 400);
  }

  if (!password) {
    throw new CustomError("email id is required", 400);
  }
  if (password && typeof password !== "string") {
    throw new CustomError("password should be of type string", 400);
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    const isAuthenticated = await user.comparePassword(password);
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      throw new CustomError("user credentials are invalid", 400);
    }

    user.password = undefined;
    const token = user.generateJWTToken();

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    throw new CustomError("user credentials are invalid", 400);
  }
});

module.exports = login;
