<<<<<<< HEAD
const asyncHandler = (requestHandler) => {
=======
 const asyncHandler = (requestHandler) => {
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

<<<<<<< HEAD
export default asyncHandler;
=======
export default asyncHandler
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
