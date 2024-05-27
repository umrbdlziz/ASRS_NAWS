const express = require("express");
const app = express();
const db = require("../models/connectdb");
const md5 = require("md5");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/all_users", async (req, res) => {
  const sql = "SELECT * FROM user";
  const result = await db.executeAllSQL(sql, []);
  res.send(result);
});

app.post("/add_user", async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = md5(password);
  const sql = "INSERT INTO user (username, password, role) VALUES (?, ?, ?)";
  try {
    await db.executeAllSQL(sql, [username, hashedPassword, role]);
    res.status(201).send({ message: "User added successfully" });
  } catch (error) {
    console.error("Failed to add user:", error);
    res.status(500).send({ message: "Failed to add user" });
  }
});

app.delete("/delete_user/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM user WHERE id = ?";
  try {
    await db.executeAllSQL(sql, [id]);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    res.status(500).send({ message: "Failed to delete user" });
  }
});

module.exports = app;
