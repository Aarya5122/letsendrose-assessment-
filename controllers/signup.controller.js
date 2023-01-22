const User = require("../models/userSchema.model");
const CustomError = require("../utils/CustomError");
const cookieOptions = require("../utils/cookieOptions");
const asyncHandler = require("../utils/asyncHandler");

const signUp = asyncHandler(async (req, res) => {
  const { email, mobileNumber, fullname, password } = req.body;

  /**
   * Check if is a particular field received
   * If filed is received then check the type of field matches with the type of feild defined in model
   */
  if (!email) {
    throw new CustomError("email id is required", 400);
  }
  if (email && typeof email !== "string") {
    throw new CustomError("email id should be of type string", 400);
  }

  if (!mobileNumber) {
    throw new CustomError("mobile number is required", 400);
  }
  if (mobileNumber && typeof mobileNumber !== "string") {
    throw new CustomError("mobile number should be of type string", 400);
  }

  if (!fullname) {
    throw new CustomError("fullname is required", 400);
  }
  if (fullname && typeof fullname !== "string") {
    throw new CustomError("fullname should be of type string", 400);
  }

  if (!password) {
    throw new CustomError("password is required", 400);
  }
  if (password && typeof password !== "string") {
    throw new CustomError("password should be of type string", 400);
  }

  /**
   * Checking if user already exists
   */
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exist", 400);
  }

  try {
    const user = await User.create({
      email,
      mobileNumber,
      fullname,
      password,
    });
    const token = user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    throw new CustomError(`${error.message}`, 500);
  }
});

module.exports = signUp;
