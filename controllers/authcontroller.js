const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.Mail_Key);

exports.postregister = async (req, res, next) => {
  const { username, email, password, fullname } = req.body;

  const isexist = await User.findOne({ username: username });
  const count = await User.find().countDocuments();
  if (isexist) {
    return res.status(400).send("user already exists");
  }
  const hashpassword = await bcrypt.hash(password, 12);
  const user = new User({
    username: username.toLowerCase(),
    email: email,
    fullname: fullname,
    password: hashpassword,
    isadmin: count === 0 ? true : false,
  });
  await user.save();

  return res.send(user);
};

exports.postsignin = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username.toLowerCase().trim() });

  if (!user) {
    return res.status(400).send("Invalid username/password ");
  }
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    return res.status(400).send("Invalid username/password ");
  }
  // if (user.isadmin) {
  //   return res.send("admin");
  // }
  const token = user.getJwtToken();

  return res.send(token);
};

//forgot password

exports.forgotpassword = async (req, res, next) => {
  const username = req.body.username;
  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(401).send("User Does Not find");
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      res.status(500).send("something went wrong");
    }
    const token = buffer.toString("hex");
    user.token = token;
    user.tokenexpire = Date.now() + 3600000;
    return user.save().then(() => {
      res.send("Reset Password Link has been sent to your Regiseter EmailID");
      const msg = {
        to: user.email,
        from: "jssingh134@gmail.com", // Use the email address or domain you verified above
        template_id: process.env.Mail_template_Id,
        dynamic_template_data: {
          name: user.username,
          link: `http://${req.hostname}/resetpassword/${token}`,
        },
      };
      sgMail
        .send(msg)
        .then(() => {})
        .catch((err) => {
          next(err);
        });
    });
  });
};

exports.resetpassword = async function (req, res, next) {
  const { token, password } = req.body;

  const userdata = await User.findOne({
    token: token,
    tokenexpire: { $gt: Date.now() },
  });

  if (!userdata) {
    return res.status(403).send("Bad Request sent to server");
  }
  bcrypt
    .hash(password, 12)
    .then((hash) => {
      userdata.password = hash;
      userdata.token = undefined;
      userdata.tokenexpire = undefined;
      return userdata.save();
    })
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      next(err);
    });
};
