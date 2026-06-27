const errorHandler = (err, req, res, next) => {
  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = `Duplicate field value: ${Object.keys(err.keyValue).join(', ')}`;
  }

  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
module.exports = errorHandler;