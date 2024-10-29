const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const errorSchema = new Schema({
  message: {
    type: String,
    require: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("errorlog", errorSchema);
