const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isauth");
const isAdmin = require("../middleware/isAdmin");
const Controller = require("../controllers/adminController");

router.get("/userCount", isAuth, isAdmin, Controller.userCount);

router.get("/users", isAuth, isAdmin, Controller.users);

router.get("/errorlog", isAuth, isAdmin, Controller.users);

module.exports = router;
