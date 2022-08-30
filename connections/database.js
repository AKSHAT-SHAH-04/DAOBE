require("dotenv").config();

const mongoose = require("mongoose");

const DB = process.env.DB_URL;

const dbConnect = mongoose
 .connect(DB)
 .then(() => console.log("DB connection successful!"))
 .catch((err) => {
  console.log(err);
 });

module.exports = { dbConnect };
