const BlogUser = require("../../models/users/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// user register
const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // check if all filled or not
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Fill All Details");
  }

  //check if user already exist
  const userExist = await BlogUser.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await BlogUser.create({ name, email, password: hashedPassword });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Cannot Register User!");
  }
});

// User login

const userLogin = asyncHandler(async (req, res) => {
  // find if user exsist
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("please fill all details!");
  }

  const user = await BlogUser.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials!");
  }
});

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: "10d" });
};

module.exports = { userRegister, userLogin };
