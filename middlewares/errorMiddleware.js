const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    return errorForDeveloper(error, res);
  } else {
    return errorForUser(error, res);
  }
};

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
