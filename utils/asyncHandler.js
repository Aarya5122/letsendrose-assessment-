const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(error.code || 500).json({
        success: false,
        message: error.message,
        src: "Async handler",
      });
    }
  };
};

module.exports = asyncHandler;
