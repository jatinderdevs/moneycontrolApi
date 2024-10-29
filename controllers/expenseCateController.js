const Cate = require("../models/expenseCate");
const MoneyManagement = require("../models/moneyManage");

exports.categories = async (req, res, next) => {
  const id = req.user.id;
  const categories = await Cate.find({ user: id, isActive: true });

  return res.send(categories);
};

exports.create = async (req, res, next) => {
  const { name, colour } = req.body;
  const id = req.user.id;
  const cate = new Cate({
    name,
    colour,
    user: id,
  });
  const isCreated = await cate.save();
  if (!isCreated) return res.send("something went wrong!");
  return res.send("Reocrd Has been Created");
};
exports.getUpdate = async (req, res, next) => {
  const id = req.params.id;
  const cate = await Cate.findOne({ _id: id }).select("name");
  if (!cate) return res.send("something went wrong");
  return res.send(cate);
};
exports.update = async (req, res, next) => {
  const { name, colour } = req.body;
  const id = req.params.id;

  const isUpdated = await Cate.updateOne(
    { _id: id },
    {
      name,
      colour,
    }
  );

  if (!isUpdated) return res.send("something went wrong!");
  return res.send("Reocrd Has been Updated");
};

exports.remove = async (req, res, next) => {
  const id = req.params.id;
  const isExist = await MoneyManagement.findOne({ categories: id });
  if (isExist) {
    const isUpdated = await Cate.updateOne(
      { _id: id },
      {
        isActive: false,
      }
    );
    if (!isUpdated) return res.send("something went wrong!");
    return res.send("Reocrd Has been Deleted");
  }
  const isRemove = await Cate.findByIdAndRemove(id);
  if (!isRemove) return res.send("something went wrong!");
  return res.send("Reocrd Has been Deleted");
};
