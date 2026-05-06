export function asyncHandler(fn) {
  return function asyncHandlerWrap(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

