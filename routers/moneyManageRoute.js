const express = require("express");
const router = express.Router();
const controller = require("../controllers/moneycontroller");
const isAuth = require("../middleware/isauth");

router.get("/", isAuth, controller.enteries);

router.get("/search", isAuth, controller.search);

router.post("/create", isAuth, controller.create);

router.get("/edit/:id", isAuth, controller.getEdit);

router.post("/edit/:id", isAuth, controller.edit);

router.post("/remove", isAuth, controller.remove);

module.exports = router;
