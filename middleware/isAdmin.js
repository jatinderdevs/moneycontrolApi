module.exports = function (req, res, next) {
  const User = req.user;

  if (!User.isadmin) {
    return res.status(401).send("User not authorized");
  }
  next();
};
