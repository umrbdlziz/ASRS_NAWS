const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/get_all_items", async (req, res) => {
  try {
    const itemSQL = "SELECT * FROM item";
    const itemResult = await db.executeAllSQL(itemSQL, []);
    res.send(itemResult);
  } catch (error) {}
});

app.post("/add_item", async (req, res) => {
  const newItems = req.body;

  // remove all item in item table
  try {
    const removeSQL = "DELETE FROM item";
    await db.executeRunSQL(removeSQL, []);
  } catch (error) {
    console.log(error.message);
  }

  // add new item to item table
  for (let item of newItems) {
    const item_code = item[0];
    const item_desc = item[1];
    const item_img = item[2] || null;

    try {
      const sql =
        "INSERT INTO item (item_code, item_desc, item_img) VALUES (?, ?, ?)";
      await db.executeRunSQL(sql, [item_code, item_desc, item_img]);
    } catch (error) {
      console.log(error.message);
    }
  }
  res.send({ message: "Item added successfully" });
});

async function getItemInfo(item_code) {
  try {
    const sql = "SELECT * FROM item WHERE item_code = ?";
    const result = await db.executeAllSQL(sql, [item_code]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

// Function to remove a specified item code a given number of times from a comma-separated string
function removeItemCodes(itemCodes, itemCode, quantity) {
  const array = itemCodes.split(",");
  let count = 0;

  const updatedArray = array.filter((code) => {
    if (code === itemCode && count < quantity) {
      count++;
      return false;
    }
    return true;
  });

  return updatedArray.join(",");
}

module.exports = { getItemInfo, removeItemCodes, app };
