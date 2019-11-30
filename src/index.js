const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
mongoose
  .connect(
    "mongodb://heroku_6n530p7d:heroku_6n530p7d@ds251158.mlab.com:51158/heroku_6n530p7d"
  )
  .then(db => console.log("database is connected"))
  .catch(err => console.log(err));

//Settings
app.set("port", process.env.PORT || 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//Routes
app.use("/api/payments", require("./routes/payment.routes"));

// Static files
// app.use(express.static(path.join(__dirname, "public")));

//Starting server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
