const express = require("express");
const controller = require("../controllers/dataManagecontroller");
const router = express.Router();
const isAuth = require("../middleware/isauth");

router.get("/catetotal", isAuth, controller.total);

router.get("/totalearning", isAuth, controller.totalEarning);

router.get("/chartdata", isAuth, controller.chartData);

router.get("/totalreport", isAuth, controller.totalOfThisMonth);

router.post("/statemet", isAuth, controller.statement);

module.exports = router;
