const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // maxLength: [50, "email length should be less than 50 charecters"],
      trim: true,
      unique: [true, "email is already registered"],
      required: [true, "email is required"],
    },
    mobileNumber: {
      type: String,
      // maxLength: [10, "mobile number should be less than 10 characters"],
      unique: [true, "mobile number already registered"],
      trim: true,
      required: [true, "mobile number is required"],
    },
    fullname: {
      type: String,
      // maxLength: [40, " fullname should be less than 40 characters"],
      trim: true,
      required: [true, "fullname is required"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password is required"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("email")) {
    this.email = CryptoJS.AES.decrypt(
      this.email,
      process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
  }

  if (this.isModified("mobileNumber")) {
    this.mobileNumber = CryptoJS.AES.decrypt(
      this.mobileNumber,
      process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
  }

  if (this.isModified("fullname")) {
    this.fullname = CryptoJS.AES.decrypt(
      this.fullname,
      process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
  }

  if (!this.isModified("password")) {
    next();
  }
  this.password = CryptoJS.AES.decrypt(
    this.password,
    process.env.ENCRYPTION_KEY
  ).toString(CryptoJS.enc.Utf8);
  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.PASSWORD_SALT)
  );
  next();
});

userSchema.methods = {
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },
  generateJWTToken: function () {
    return JWT.sign(
      {
        userId: this._id,
        email: this.email,
        mobileNumber: this.mobileNumber,
      },
      process.env.JWT_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
      }
    );
  },
};

module.exports = mongoose.model("user", userSchema);
