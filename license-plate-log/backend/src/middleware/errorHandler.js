function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }
  const status = err.status && Number.isFinite(err.status) ? err.status : 500;
  const body =
    process.env.NODE_ENV === "production"
      ? { error: status === 500 ? "Internal Server Error" : err.message }
      : { error: err.message, stack: err.stack };
  res.status(status).json(body);
}

module.exports = { errorHandler };
