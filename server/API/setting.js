const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/all_station", async (req, res) => {
  const sql = "SELECT * FROM station";
  const result = await db.executeAllSQL(sql, []);
  res.send(result);
});

module.exports = app;
