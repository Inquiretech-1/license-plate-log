const {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} = require("@prisma/client");
const config = require("../config");

function formatMessage(err) {
  if (typeof err === "string") return err;
  if (err && err.message) return err.message;
  return "An unexpected error occurred";
}

/**
 * Express error-handling middleware (must be last).
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  console.error(err);

  const isDev = config.nodeEnv === "development";

  // JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
      ...(isDev && { stack: err.stack }),
    });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
      ...(isDev && { stack: err.stack }),
    });
  }

  // express-validator
  if (err.type === "validation" || err.name === "ValidationError" || Array.isArray(err.errors)) {
    const msg =
      err.errors && err.errors[0] && err.errors[0].msg
        ? err.errors[0].msg
        : formatMessage(err);
    return res.status(400).json({
      success: false,
      error: msg,
      ...(isDev && { stack: err.stack }),
    });
  }

  // Multer
  if (err.code === "LIMIT_FILE_SIZE" || err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      error: err.message || "File upload error",
      ...(isDev && { stack: err.stack }),
    });
  }

  // Prisma
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const raw = err.meta && err.meta.target;
        const target = raw
          ? Array.isArray(raw)
            ? raw.join(", ")
            : String(raw)
          : "field";
        return res.status(409).json({
          success: false,
          error: `Unique constraint failed on ${target}`,
          ...(isDev && { stack: err.stack }),
        });
      }
      case "P2025":
        return res.status(404).json({
          success: false,
          error: "Record not found",
          ...(isDev && { stack: err.stack }),
        });
      case "P2003":
        return res.status(400).json({
          success: false,
          error: "Foreign key constraint failed",
          ...(isDev && { stack: err.stack }),
        });
      default:
        return res.status(400).json({
          success: false,
          error: formatMessage(err),
          ...(isDev && { stack: err.stack }),
        });
    }
  }

  if (err instanceof PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: "Database validation error",
      ...(isDev && { stack: err.stack }),
    });
  }

  const status = err.statusCode || err.status || 500;
  const message =
    status === 500 && !isDev ? "Internal Server Error" : formatMessage(err);

  res.status(status).json({
    success: false,
    error: message,
    ...(isDev && { stack: err.stack }),
  });
}

module.exports = errorHandler;
