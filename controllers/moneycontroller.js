const MoneyManagement = require("../models/moneyManage");
const Cate = require("../models/expenseCate");
const moment = require("moment");

let date = new Date();
let month = moment(date).format("MM");
let year = moment(date).format("YYYY");
let startdate = moment().startOf("month").format("DD");
let endate = moment().endOf("month").format("DD");

exports.enteries = async (req, res, next) => {
  const id = req.user.id;
  const { pageSize, page } = req.query;
  const skipRecords = (page - 1) * pageSize;

  const totalEnteries = await MoneyManagement.find({
    user: id,
    createdAt: {
      $gte: new Date(`${year}-${month}-${startdate}`),
      $lte: new Date(`${year}-${month}-${endate}`),
    },
  }).countDocuments();

  const enteries = await MoneyManagement.find({
    user: id,
    createdAt: {
      $gte: new Date(`${year}-${month}-${startdate}`),
      $lte: new Date(`${year}-${month}-${endate}`),
    },
  })
    .skip(skipRecords)
    .limit(pageSize)
    .populate({
      path: "categories",
      select: "name",
    })
    .sort({ createdAt: -1 });
  return res.send({ enteries, totalEnteries });
};

exports.create = async (req, res, next) => {
  const { paymentType, tag, amount, categories } = req.body;

  if (paymentType !== "earning" && paymentType !== "expense") {
    return res.status(400).send("Bad Request send to server");
  }
  if (categories) {
    const hascategory = await Cate.findOne({ _id: categories });
    if (!hascategory) {
      return res.status(400).send("Bad Request send to server");
    }
  }

  const user = req.user.id;

  const entry = new MoneyManagement({
    paymentType,
    tag,
    amount,
    categories,
    user: user,
  });
  const isCreated = await entry.save();
  if (!isCreated) return res.status(500).send("something Went wrong");
  return res.send("Entery Has been Created");
};
exports.getEdit = async (req, res, next) => {
  const userid = req.user.id;
  const id = req.params.id;
  const Entry = await MoneyManagement.findOne({ _id: id, user: userid }).select(
    "-_id  -createdAt -user -updatedAt -__v"
  );
  if (!Entry) return res.send("something went wrong");
  return res.send(Entry);
};

exports.edit = async (req, res, next) => {
  const userid = req.user.id;
  const { tag, amount, categories } = req.body;
  const id = req.params.id;

  const entry = await MoneyManagement.findOne({ _id: id, user: userid });

  if (!entry) return res.status(401).send("Bad Request");
  if (categories === "earning") {
    entry.categories = undefined;
    entry.paymentType = "earning";
  } else {
    entry.paymentType = "expense";
    entry.categories = categories;
  }

  entry.amount = amount;
  entry.tag = tag;

  const updateEntry = await entry.save();
  if (!updateEntry) return res.status(500).send("Something Went Wrong");
  return res.status(200).send(updateEntry);
};

exports.search = async (req, res, next) => {
  const query = req.query.keyword;
  const id = req.user.id;

  const regx = new RegExp(`.*${query}.*`, "i");

  const entries = await MoneyManagement.find({
    tag: regx,
    user: id,
    createdAt: {
      $gte: new Date(`${year}-${month}-${startdate}`),
      $lte: new Date(`${year}-${month}-${endate}`),
    },
  })
    .populate({
      path: "categories",
      select: "name",
    })
    .sort({ createdAt: -1 });

  res.send(entries);
};

exports.remove = async (req, res, next) => {
  const userid = req.user.id;
  const id = req.body.id;

  const removed = await MoneyManagement.findOneAndDelete({
    _id: id,
    user: userid,
  });

  if (!removed) return res.send("something went wrong");
  return res.send(removed);
};
