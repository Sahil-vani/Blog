const errorHandler = (error, req, res, next) => {
  //   console.log(res.statusCode);
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;

  res.status(statusCode);

  res.json({
    message: error.message,
    stack: error.stack,
  });
};

module.exports = errorHandler;
