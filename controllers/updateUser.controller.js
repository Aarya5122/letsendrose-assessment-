const User = require("../models/userSchema.model");
const CustomError = require("../utils/CustomError");
const cookieOptions = require("../utils/cookieOptions");
const asyncHandler = require("../utils/asyncHandler");
var CryptoJS = require("crypto-js");

const updateUser = asyncHandler(async (req, res) => {
  const { email, mobileNumber, fullname } = req.body;

  let updationObject = {};

  /**
   * Check if is a particular field received
   * If filed is received then check the type of field matches with the type of feild defined in model
   */

  if (email && typeof email !== "string") {
    throw new CustomError("email id should be of type string", 400);
  }

  Object.defineProperty(updationObject, "email", {
    value: email,
    enumerable: true,
  });

  if (mobileNumber && typeof mobileNumber !== "string") {
    throw new CustomError("mobile number should be of type string", 400);
  }

  Object.defineProperty(updationObject, "mobileNumber", {
    value: mobileNumber,
    enumerable: true,
  });

  if (fullname && typeof fullname !== "string") {
    throw new CustomError("fullname should be of type string", 0);
  }

  Object.defineProperty(updationObject, "fullname", {
    value: fullname,
    enumerable: true,
  });

  if (updationObject.email) {
    updationObject.email = CryptoJS.AES.encrypt(email, process.env.ENCRYPTION_KEY).toString();
  }
  if (updationObject.fullname) {
    updationObject.fullname = CryptoJS.AES.encrypt(
      fullname,
      process.env.ENCRYPTION_KEY
    ).toString();
  }
  if (updationObject.mobileNumber) {
    updationObject.mobileNumber = CryptoJS.AES.encrypt(
      mobileNumber,
      process.env.ENCRYPTION_KEY
    ).toString();
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updationObject);
    console.log(user);
    const token = user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      token,
      user,
    });
  } catch (error) {
    throw new CustomError(`${error.message}`, 500);
  }
});

module.exports = updateUser;
