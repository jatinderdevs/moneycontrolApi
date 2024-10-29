const Payments = require("../models/duePayments");
//enteries collection
const moneyManage = require("../models/moneyManage");

exports.duePayments = async (req, res, next) => {
  const user = req.user.id;
  const dueEntries = await Payments.find({ user });
  return res.send(dueEntries);
};
//total due amount
exports.totalDue=async(req,res,next)=>{
  
  const user = req.user.id;
  const userAmount = await Payments.find({ user }).select("amount");
  const dues = userAmount.reduce((total, due) => {
    return (total += due.amount);
  }, 0);

  return res.send({dues});
}
exports.create = async (req, res, next) => {
  const user = req.user.id;

  const { tag, amount } = req.body;

  const Payment = new Payments({
    tag,
    amount,
    user,
  });
  const isCreated = await Payment.save();
  if (!isCreated) return res.status(500).send("something went wrong!");
  return res.send(isCreated);
};

exports.isDone = async (req, res, next) => {
  const id = req.body.id;
  const user = req.user.id;
  const dueEntry = await Payments.findOne({ _id: id, user: user });
  if (!dueEntry) return res.status(404).send("Bad Request to Server!");

  const entry = new moneyManage({
    paymentType: "earning",
    tag: dueEntry.tag,
    amount: dueEntry.amount,
    user: user,
  });
  entry
    .save()
    .then(() => {
      return Payments.findByIdAndRemove({ _id: id }).then((remove) => {
        if (!remove) return res.status(500).send("something went wrong!");
        return res.json(remove);
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.remove = async (req, res, next) => {
  const id = req.body.id;
  const user = req.user.id;
  const remove = await Payments.findOneAndDelete({ _id: id, user: user });
  if (!remove) return res.status(404).send("Bad Request to Server!");
  return res.send(remove);
};
