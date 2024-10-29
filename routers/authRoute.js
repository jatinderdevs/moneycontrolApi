const express = require("express");
const controller = require("../controllers/authcontroller");
const router = express.Router();

router.post("/signup", controller.postregister);

router.post("/signin", controller.postsignin);

router.post("/forgotpassword", controller.forgotpassword);

router.post("/resetpassword", controller.resetpassword);

module.exports = router;
