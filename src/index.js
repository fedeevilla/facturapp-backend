const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const app = express();
mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}`,
    // `mongodb://localhost:27017`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("database is connected"))
  .catch(err => console.log(err));

//Settings
app.set("port", process.env.PORT || 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/user", require("./routes/user.routes"));

//Starting server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
