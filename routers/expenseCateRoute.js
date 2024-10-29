const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isauth");

const controller = require("../controllers/expenseCateController");

router.get("/", isAuth, controller.categories);

router.post("/Create", isAuth, controller.create);

router.get("/update/:id", isAuth, controller.getUpdate);

router.post("/update/:id", isAuth, controller.update);

router.post("/remove/:id", isAuth, controller.remove);

module.exports = router;
