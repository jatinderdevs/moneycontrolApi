const User = require("../models/user");

const bcrypt = require("bcryptjs");

exports.changePassword = async (req, res, next) => {
  const { newpassword, oldpassword } = req.body;
  const userdata = await User.findOne({ _id: req.user.id }).select("password");

  if (!userdata) {
    res.status(401).send("bad Request To server");
  }

  const ismatch = await bcrypt.compare(oldpassword, userdata.password);
  if (!ismatch) {
    return res.status(400).send("Old password is not Correct");
  }

  bcrypt
    .hash(newpassword, 12)
    .then((hash) => {
      userdata.password = hash;
      return userdata.save();
    })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      next(err);
    });
};
