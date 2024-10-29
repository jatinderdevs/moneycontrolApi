const express = require("express");
const controller = require("../controllers/duePaymentController");
const router = express.Router();
const isAuth = require("../middleware/isauth");

router.get("/", isAuth, controller.duePayments);

router.post("/create", isAuth, controller.create);
router.get("/totalDuePayements", isAuth,controller.totalDue);
router.post("/isdone", isAuth, controller.isDone);
router.post("/remove", isAuth, controller.remove);

module.exports = router;
