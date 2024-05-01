const express = require("express");
const { connectDB } = require("./config/dbConfig");
const app = express();
const errorHandler = require("./middleware/errorHandler");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cors = require("cors");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;

// DB Connection
connectDB();

// upload routes
app.post("/profile", upload.single("avatar"), function (req, res) {
  console.log("uploads", req.body);
  res.send("file uploaded");
});

// Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// cors
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);

// Handle preflight requests
app.options(`${process.env.FRONTEND_URL}`, cors());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome To Blog V1.0",
  });
});

// user routes
app.use("/api/user", require("./routes/users/userRegister"));

// blog routes
app.use("/api/blog", require("./routes/blogs/blogRoutes"));

//error handler
app.use(errorHandler);

app.listen(PORT, (req, res) => {
  console.log(`Server is running at port : ${PORT}`);
});
