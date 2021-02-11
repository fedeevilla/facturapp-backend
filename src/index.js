const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const axios = require("axios");

require("dotenv").config();

const app = express();
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database is connected"))
  .catch((err) => console.log(err));

//Settings
app.set("port", process.env.PORT || 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(helmet());

//Routes
app.use("/api/invoices", require("./routes/invoice.routes"));
app.use("/api/user", require("./routes/user.routes"));

app.get("/eth", (_, res) => {
  axios
    .get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
    .then(({ data }) => {
      res.json(data);
    });
});

//Starting server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
