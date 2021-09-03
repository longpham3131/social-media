const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// require("dotenv").config();
router.get("/", (req, res) => res.send("USER ROUTE"));
const { error500, error400 } = require("../util/res");
//@route POST api/auth/register

//REGISTER
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  try {
    //check exits user
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    const email = await User.findOne({ email });
    if (email)
      return res
        .status(400)
        .json({ success: false, message: "Email already taken" });
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });
    await newUser.save();
    const date = new Date();
    date.setDate(date.getDate() + 3);
    //Return token
    const accessToken = jwt.sign(
      { userId: newUser._id, expired: date },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});
//@route POST api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return error400(res, "Incorrect username or password");
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) return error400(res, "Incorrect username or password");

    const date = new Date();
    date.setDate(date.getDate() + 3);
    const accessToken = jwt.sign(
      { userId: user._id, expired: date },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Login successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});

module.exports = router;
