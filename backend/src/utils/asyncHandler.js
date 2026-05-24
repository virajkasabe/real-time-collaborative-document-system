<<<<<<< HEAD
<<<<<<< HEAD
const asyncHandler = (requestHandler) => {
=======
 const asyncHandler = (requestHandler) => {
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
=======
const asyncHandler = (requestHandler) => {
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

<<<<<<< HEAD
<<<<<<< HEAD
export default asyncHandler;
=======
export default asyncHandler
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
=======
export default asyncHandler;
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
