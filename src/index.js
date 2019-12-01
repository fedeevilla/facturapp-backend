const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const app = express();
mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(db => console.log("database is connected"))
  .catch(err => console.log(err));

//Settings
app.set("port", process.env.PORT || 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/payments", require("./routes/payment.routes"));

//Starting server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
