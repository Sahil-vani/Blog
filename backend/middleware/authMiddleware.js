const asyncHandler = require("express-async-handler");
const BlogUser = require("../models/users/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decode = jwt.verify(token, process.env.TOKEN_SECRET);
      // get user from token
      const user = await BlogUser.findById(decode.id).select("-password");

      if (!user) {
        res.status(401);
        throw new Error("You Are Unauthorized!");
      }
      req.user = user;

      next();
    } catch (error) {
      res.status(400);
      throw new Error("Invalid User");
    }
  } else {
    res.status(401);
    throw new Error("You Are Unauthorizated");
  }
});

module.exports = { protect };
