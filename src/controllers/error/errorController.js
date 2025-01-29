import AppError from "../../utils/appError.js";

const handleDuplicateFieldsDB = (err) => {
  const value = err?.errmsg?.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again!", 401);

const sendErrorDev = (err, req, res) => {

  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }

  console.error("ERROR 💥", err);

  if (req.originalUrl.startsWith("/api")) {
    return res.status(500).json({
      success: false,
      message: "Something went very wrong!",
    });
  }

  return res.status(500).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.success = false;

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "local"
  ) {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let customError = { ...err };
    customError.message = err.message;

    if (customError.name === "CastError")
      customError = handleCastErrorDB(customError);
    if (customError.code === 11000)
      customError = handleDuplicateFieldsDB(customError);
    if (customError.name === "ValidationError")
      customError = handleValidationErrorDB(customError);
    if (customError.name === "JsonWebTokenError")
      customError = handleJWTError();
    if (customError.name === "TokenExpiredError")
      customError = handleJWTExpiredError();
    if (customError.name === "MulterError")
      customError = new AppError(customError.message, 500);

    sendErrorProd(customError, req, res);
  }
};
