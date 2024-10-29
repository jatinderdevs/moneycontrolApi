const mongoose = require("mongoose");

const schema = mongoose.Schema;

const moneyschema = new schema(
  {
    paymentType: {
      type: "String",
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    categories: {
      type: schema.Types.ObjectId,
      ref: "expenseCate",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("moneymanagement", moneyschema);
