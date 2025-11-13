// Error handler to display the error as JSON
export const errorHandler = (err, req, res, next) => {
  console.error('Error middleware:', err.stack || err);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

// This error handling middleware helps maintain consistency in error responses and makes debugging easier by providing meaningful error messages.
