const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();
const isAuth = require("../middleware/isauth");

router.post("/changepassword", isAuth, controller.changePassword);

module.exports = router;
