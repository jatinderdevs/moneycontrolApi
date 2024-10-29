const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Jwt = require("jsonwebtoken");
const userschema = new schema(
  {
    fullname: {
      type: "String",
      required: true,
    },
    username: {
      type: "String",
      trim: true,
      required: true,
    },
    email: {
      type: "String",
      required: true,
    },
    password: {
      type: "String",
      required: true,
    },
    profileimage: {
      type: "String",
      default: "images/user.jpg",
    },
    isadmin: {
      type: "Boolean",
      default: false,
    },
    isverified: {
      type: "Boolean",
      default: false,
    },
    token: {
      type: "String",
    },
    tokenexpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

userschema.methods.getJwtToken = function () {
  const userinfo = {
    id: this._id,
    username: this.username,
    fullname: this.fullname,
    email: this.email,
    img: this.profileimage,
    isadmin: this.isadmin,
  };

  const token = Jwt.sign(userinfo, process.env.JwtPrivateKey);
  return token;
};

module.exports = mongoose.model("user", userschema);
