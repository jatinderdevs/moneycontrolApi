require("dotenv").config();
require("express-async-errors");
require("winston-mongodb");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const auth = require("./routers/authRoute");
const money = require("./routers/moneyManageRoute");
const Cate = require("./routers/expenseCateRoute");
const dataManage = require("./routers/dataManage");
const duePayment = require("./routers/duePaymentRoute");
const user = require("./routers/userRoute");
const admin = require("./routers/adminRoute");
const winston = require("winston");

const DATABASE_URI =
  "mongodb+srv://jazz:G5af6zgIDtx7U5sV@cluster0.jlweb.mongodb.net/moneymanagement_db?retryWrites=true&w=majority";
//const DATABASE_URI = "mongodb://localhost:27017/moneymanagement";

winston.add(
  new winston.transports.MongoDB({
    db: DATABASE_URI,
    level: "info",
    capped: true,
    metaKey: "meta",
  })
);

app.use(cors());

app.use(express.json());
app.use(dataManage);
//pending Payments route
app.use("/duepayment", duePayment);
app.use("/auth", auth);
app.use("/entery", money);
app.use("/expenseCategory", Cate);
app.use("/user", user);
app.use("/admin", admin);

app.use(function (err, req, res, next) {
  winston.error(err.message, err);
  return res.status(500).send(err.message);
});

mongoose
  .connect(DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Connected Successfully");
    });
  });
