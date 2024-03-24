const ApiError = require("../utils/apiError");

const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    return errorForDeveloper(error, res);
  } else {
    if (error.name === "JsonWebTokenError") error = handleJwtInvalidSignature();
    if (error.name === "TokenExpiredError") error = handleJwtExpired();
    return errorForUser(error, res);
  }
};

const handleJwtInvalidSignature = (error, res) =>
  new ApiError("Invalid Token, Please login to access", 401);
const handleJwtExpired = (error, res) =>
  new ApiError("Expired Token, Please login to access ", 401);
const errorForDeveloper = (error, res) => {
  return res.status(error.statusCode).json({
    errors: error,
    message: error.message,
    stack: error.stack,
  });
};

const errorForUser = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

module.exports = errorHandler;
