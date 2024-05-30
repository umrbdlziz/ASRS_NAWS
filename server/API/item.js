const express = require("express");
const app = express();
const db = require("../models/connectdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

module.exports = { getItemInfo, removeItemCodes };
