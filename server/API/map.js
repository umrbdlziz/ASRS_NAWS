const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/get_map", async (req, res) => {
  let data = {};

  try {
    const rmfSQL = "SELECT value FROM constants WHERE constant = ?";
    const rmfResult = await db.executeGetSQL(rmfSQL, ["rmf api"]);

    if (!rmfResult) {
      return res.status(404).send({ message: "RMF API not found." });
    }

    const rmfAPI = rmfResult.value;

    try {
      const mapResponse = await fetch(`http://${rmfAPI}/building_map`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!mapResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const mapData = await mapResponse.json();

      data = {
        map: mapData,
      };

      res.send(data);
    } catch (error) {
      console.error("Error getting map:", error.message);
      return;
    }
  } catch (error) {
    console.log("Error getting ip:", error);
  }
});

app.get("/get_tasks", async (req, res) => {
  let data = {};

  try {
    const rmfSQL = "SELECT value FROM constants WHERE constant = ?";
    const rmfResult = await db.executeGetSQL(rmfSQL, ["rmf api"]);

    if (!rmfResult) {
      return res.status(404).send({ message: "RMF API not found." });
    }

    const rmfAPI = rmfResult.value;

    try {
      const tasksResponse = await fetch(`http://${rmfAPI}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!tasksResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const tasksData = await tasksResponse.json();

      data = {
        tasks: tasksData,
      };

      res.send(data);
    } catch (error) {
      console.error("Error getting tasks:", error.message);
      return;
    }
  } catch (error) {}
});

module.exports = app;
