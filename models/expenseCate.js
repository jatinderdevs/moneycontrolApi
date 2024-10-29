const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CateSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  colour: {
    type: String,
    default: "#fff",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("expenseCate", CateSchema);
