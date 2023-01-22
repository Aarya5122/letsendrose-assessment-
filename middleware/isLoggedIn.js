const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError");
const JWT = require("jsonwebtoken");
const User = require("../models/userSchema.model")

const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : "");

    if(!token){
        throw new CustomError("user not logged in", 401)
    }
    try{
        const payload = JWT.verify(token, process.env.JWT_TOKEN_SECRET)
        req.user = await User.findById(payload.userId);
        next()
    } catch(error){
        throw new CustomError("unauthenticated user", 400)
    }
});

module.exports = isLoggedIn;
