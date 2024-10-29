const Cate = require("../models/expenseCate");
const Entery = require("../models/moneyManage");
const moment = require("moment");
const ExcelJs = require("exceljs");
let date = new Date();
let month = moment(date).format("MM");
let year = moment(date).format("YYYY");
let startdate = moment().startOf("month").format("DD");
let endate = moment().endOf("month").format("DD");

exports.total = async (req, res, next) => {
  let total = 0;
  const id = req.user.id;
  const cates = await Cate.find({ user: id, isActive: true });
  const object = [];

  for (let a of cates) {
    const entery = await Entery.find({
      categories: a._id,
      createdAt: {
        $gte: new Date(`${year}-${month}-${startdate}`),
        $lte: new Date(`${year}-${month}-${endate}`),
      },
      user: id,
    }).select("amount");
    for (let e of entery) {
      total += e.amount;
    }
    object.push({
      _id: a._id,
      name: a.name,
      colour: a.colour,
      user: a.user,
      total: total,
    });

    total = 0;
  }

  return res.send(object);
};

exports.totalEarning = async (req, res, next) => {
  let total = 0;
  const id = req.user.id;
  const enteries = await Entery.find({
    paymentType: "earning",
    createdAt: {
      $gte: new Date(`${year}-${month}-${startdate}`),
      $lte: new Date(`${year}-${month}-${endate}`),
    },
    user: id,
  }).select("amount");

  for (let e of enteries) {
    total += e.amount;
  }

  return res.json(total);
};

exports.chartData = async (req, res, next) => {
  const id = req.user.id;
  let total = 0;
  const weeklyExpenses = [];
  const weeklyEarnings = [];
  const dayNames = [];

  //for excute the for loop
  const getCurrentDate = Date.now();
  const startDate = Date.now() - 7 * 60 * 60 * 24 * 1000;

  for (
    let a = new Date(startDate);
    a < new Date(getCurrentDate);
    a.setDate(a.getDate() + 1)
  ) {
    //calculate Expenses;
    const YEAR = moment(a).format("YYYY");
    const MONTH = moment(a).format("MM");
    const DAY = moment(a).format("DD");
    const dayname = moment(a).format("dd");
    const entery = await Entery.find({
      paymentType: "expense",
      createdAt: {
        $gte: new Date(`${YEAR}-${MONTH}-${DAY}`),
        $lte: new Date(
          `${YEAR}-${parseInt(DAY) === 31 ? parseInt(MONTH) + 1 : MONTH}-${
            parseInt(DAY) === 31 ? 01 : parseInt(DAY) + 1
          }`
        ),
      },
      user: id,
    }).select("amount");

    for (let e of entery) {
      total += e.amount;
    }
    dayNames.push(dayname);

    weeklyExpenses.push(total);
    total = 0;
  }

  //calculate earnings
  for (
    let a = new Date(startDate);
    a < new Date(getCurrentDate);
    a.setDate(a.getDate() + 1)
  ) {
    const YEAR = moment(a).format("YYYY");
    const MONTH = moment(a).format("MM");
    const DAY = moment(a).format("DD");

    const entery = await Entery.find({
      paymentType: "earning",
      createdAt: {
        $gte: new Date(`${YEAR}-${MONTH}-${DAY}`),
        $lte: new Date(
          `${YEAR}-${parseInt(DAY) === 31 ? parseInt(MONTH) + 1 : MONTH}-${
            parseInt(DAY) === 31 ? 01 : parseInt(DAY) + 1
          }`
        ),
      },
      user: id,
    }).select("amount");

    for (let e of entery) {
      total += e.amount;
    }

    weeklyEarnings.push(total);
    total = 0;
  }
  return res.json({ weeklyExpenses, weeklyEarnings, dayNames });
};

exports.totalOfThisMonth = async (req, res, next) => {
  const id = req.user.id;
  let saving = 0;
  const expenseEnteries = await Entery.find({
    paymentType: "expense",
    createdAt: {
      $gte: new Date(`${year}-${month}-${startdate}`),
      $lte: new Date(`${year}-${month}-${endate}`),
    },
    user: id,
  }).select("amount");

  const earningEnteries = await Entery.find({
    paymentType: "earning",
    createdAt: {
      $gte: new Date(`${year}-${month}-${startdate}`),
      $lte: new Date(`${year}-${month}-${endate}`),
    },
    user: id,
  }).select("amount");

  const expense = expenseEnteries.reduce((total, entery) => {
    return (total += entery.amount);
  }, 0);

  const earning = earningEnteries.reduce((total, entery) => {
    return (total += entery.amount);
  }, 0);
  if (earning !== 0 && earning > expense) {
    saving = Math.abs(expense - earning);
  }

  return res.send({ expense, earning, saving });
};

exports.statement = async (req, res, next) => {
  const id = req.user.id;

  const { startDate, endDate } = req.body;
  let updateDate = new Date(endDate);
  updateDate.setDate(updateDate.getDate() + 1);
  const enteries = await Entery.find({
    createdAt: {
      $gte: startDate,
      $lte: updateDate,
    },
    user: id,
  }).populate({
    path: "categories",
    select: "name",
  });

  const Workbook = new ExcelJs.Workbook();
  const workSheet = Workbook.addWorksheet("MyStatement");
  workSheet.columns = [
    { header: "sr no", key: "s_no", width: 10 },
    { header: "CreatedAt", key: "CreatedAt", width: 10 },
    { header: "PaymentType", key: "PaymentType", width: 10 },
    { header: "Tag", key: "Tag", width: 10 },
    { header: "Category", key: "Category", width: 10 },
    { header: "Amount", key: "Amount", width: 10 },
  ];
  let count = 1;
  enteries.forEach((row) => {
    workSheet.addRow({
      s_no: count,
      CreatedAt: row.createdAt,
      PaymentType: row.paymentType,
      Tag: row.tag,
      Category: row.categories?.name,
      Amount: row.amount,
    });
    count += 1;
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=test.xlsx");
  return Workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};
