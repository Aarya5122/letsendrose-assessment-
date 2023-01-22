const express = require("express");
const router = express.Router()
const isLoggedIn = require("../middleware/isLoggedIn")

const signUp = require("../controllers/signup.controller")
const login = require("../controllers/login.controller");
const passwordReset = require("../controllers/passwordReset.controller");
const updateUser = require("../controllers/updateUser.controller");

router.route("/signup").post(signUp)
router.route("/login").post(login);
router.route("/").get((req,res)=>res.send("Working"));

router.route("/user/auth/reset/password").put(isLoggedIn, passwordReset);
router.route("/user").put(isLoggedIn, updateUser);

module.exports = router