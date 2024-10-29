const User = require("../models/user");

exports.userCount = async function (req, res, next) {
  const userCount = await User.find().countDocuments();
  return res.json(userCount);
};
exports.users = async function (req, res, next) {
  const users = await User.find().select("-updatedAt -__v");
  return res.json(users);
};
