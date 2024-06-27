const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/retrieve", async (req, res) => {
  try {
    const retrieveSQL = `SELECT * FROM retrieve WHERE STATUS != 0`;
    const retrieveResult = await db.executeAllSQL(retrieveSQL, []);

    res.send(retrieveResult);
  } catch (error) {
    console.log("Error retrieving all retrieve data:", error);
  }
});

app.get("/store", async (req, res) => {
  try {
    const storeSQL = `SELECT * FROM store WHERE status != 0`;
    const storeResult = await db.executeAllSQL(storeSQL, []);

    res.send(storeResult);
  } catch (error) {
    console.log("Error retrieving all store data:", error);
  }
});

app.get("/total_items", async (req, res) => {
  // total items in pigeonhole
  let itemQuantities = 0;
  let storePercentage = 0;
  let retrievePercentage = 0;
  try {
    const pigeonholeSQL = "SELECT pigeonhole_id, item_code FROM pigeonhole";
    const pigeonholeResult = await db.executeAllSQL(pigeonholeSQL, []);

    pigeonholeResult.forEach((row) => {
      if (row.item_code && row.item_code.trim() !== "") {
        const itemCodes = row.item_code.split(",").map((code) => code.trim());
        itemCodes.forEach(() => {
          itemQuantities++;
        });
      }
    });
  } catch (error) {
    console.log("Error retrieving total items:", error.message);
  }

  // percentages of items need to store in warehouse
  try {
    const storeSQL =
      "SELECT SUM(item_quantity) as total_items FROM store WHERE status != 0";
    const storeResult = await db.executeAllSQL(storeSQL, []);

    const totalStoreSQL = "SELECT SUM(item_quantity) as total_items FROM store";
    const totalStoreResult = await db.executeAllSQL(totalStoreSQL, []);

    storePercentage =
      (storeResult[0].total_items / totalStoreResult[0].total_items) * 100;
  } catch (error) {
    console.log("Error retrieving store percentage:", error.message);
  }

  try {
    const retrieveSQL =
      "SELECT SUM(item_quantity) as total_items FROM retrieve WHERE status != 0";
    const retrieveResult = await db.executeAllSQL(retrieveSQL, []);

    const totalRetrieveSQL =
      "SELECT SUM(item_quantity) as total_items FROM retrieve";
    const totalRetrieveResult = await db.executeAllSQL(totalRetrieveSQL, []);

    retrievePercentage =
      (retrieveResult[0].total_items / totalRetrieveResult[0].total_items) *
      100;
  } catch (error) {
    console.log("Error retrieving retrieve percentage:", error.message);
  }

  res.send({
    total_items: itemQuantities,
    store_percentage: storePercentage,
    retrieve_percentage: retrievePercentage,
  });
});

app.get("/items", async (req, res) => {
  const { pigeonhole_id } = req.query;

  try {
    if (pigeonhole_id) {
      // Fetch total items in the specified pigeonhole
      const getTotalItemsSQL =
        "SELECT item_code FROM pigeonhole WHERE pigeonhole_id = ?";
      const result = await db.executeAllSQL(getTotalItemsSQL, [pigeonhole_id]);

      if (result.length > 0 && result[0].item_code) {
        // Check if item_code is not null
        const totalItems = result[0].item_code.split(",").length;
        const temp = result[0].item_code.split(",");
        res.send({ pigeonhole_id, totalItems, temp });
      } else {
        res
          .status(404)
          .send({ message: "Pigeonhole not found or no items in pigeonhole" });
      }
    } else {
      // Fetch total items in all pigeonholes
      const getAllItemsSQL = "SELECT item_code FROM pigeonhole";
      const results = await db.executeAllSQL(getAllItemsSQL);

      let totalItems = 0;
      results.forEach((row) => {
        if (row.item_code) {
          // Check if item_code is not null before splitting
          totalItems += row.item_code.split(",").length;
        }
      });

      res.send({ totalItems });
    }
  } catch (error) {
    console.log("Error in /items:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
});

app.get("/user_performance", async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const startOfWeekString = startOfWeek.toISOString().split("T")[0];
    const endOfWeekString = endOfWeek.toISOString().split("T")[0];

    const userSQL = "SELECT id, username FROM user WHERE role = ?";
    const userResult = await db.executeAllSQL(userSQL, ["operator"]);

    const performanceData = [];

    for (const user of userResult) {
      const userId = user.id;

      const storeSQL = `
        SELECT 
          DATE(datetime_store) as date,
          SUM(item_quantity) as total_stored
        FROM store
        WHERE user_id = ? AND DATE(datetime_store) BETWEEN ? AND ?
        GROUP BY DATE(datetime_store)
      `;
      const storeResult = await db.executeAllSQL(storeSQL, [
        userId,
        startOfWeekString,
        endOfWeekString,
      ]);

      const retrieveSQL = `
        SELECT 
          DATE(datetime_retrieve) as date,
          SUM(item_quantity) as total_retrieved
        FROM retrieve
        WHERE user_id = ? AND DATE(datetime_retrieve) BETWEEN ? AND ?
        GROUP BY DATE(datetime_retrieve)
      `;
      const retrieveResult = await db.executeAllSQL(retrieveSQL, [
        userId,
        startOfWeekString,
        endOfWeekString,
      ]);

      let dailyData = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split("T")[0];

        let stored = 0;
        storeResult.forEach((row) => {
          if (row.date === dateString) {
            stored = row.total_stored;
          }
        });

        let retrieved = 0;
        retrieveResult.forEach((row) => {
          if (row.date === dateString) {
            retrieved = row.total_retrieved;
          }
        });

        dailyData.push({
          date: dateString,
          total_stored: stored,
          total_retrieved: retrieved,
        });
      }

      performanceData.push({
        userId: userId,
        username: user.username,
        dailyData: dailyData,
      });
    }

    res.send(performanceData);
  } catch (error) {
    console.log("Error retrieving user performance:", error);
    res.status(500).send("Error retrieving user performance");
  }
});

module.exports = app;
