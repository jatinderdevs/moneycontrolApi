const mongoose = require("mongoose");

const schema = mongoose.Schema;

const duePayment = new schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("duepayment", duePayment);
